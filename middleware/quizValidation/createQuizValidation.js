import Joi from 'joi';
import JoiDate from '@joi/date';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

// Using @joi/date
// Allows the use of the .format() function on dates to put own fields eg (YYYY-MM-DD)
// We extend the initial Joi import to allow the @joi/date to work with it
const JoiDates = Joi.extend(JoiDate);

const quizNameSchemaObj = Joi.string()
  .min(quizValues.QUIZ_NAME.min)
  .max(quizValues.QUIZ_NAME.max)
  .pattern(quizValues.QUIZ_NAME.pattern);

const quizCategorySchemaObj = Joi.number().min(quizValues.CATEGORIES_MIN_MAX.min).max(quizValues.CATEGORIES_MIN_MAX.max);

const quizName = (name, string) => {
  return quizNameSchemaObj.required().messages({
    'string.base': schemaMessages.base(name, string),
    'string.min': schemaMessages.min(name, quizValues.QUIZ_NAME.min),
    'string.max': schemaMessages.max(name, quizValues.QUIZ_NAME.max),
    'string.pattern.base': schemaMessages.patternAlpha(name),
    'string.empty': schemaMessages.empty(name),
    'any.required': schemaMessages.required(name),
  });
};

const quizDifficulty = (difficulty, string) => {
  const diffArray = Object.values(quizValues.CATEGORY_DIFFICULTY);
  return Joi.string()
    .valid(...diffArray)
    .required()
    .messages({
      'string.base': schemaMessages.base(difficulty, string),
      'string.empty': schemaMessages.empty(difficulty),
      'any.only': schemaMessages.valid(difficulty, diffArray),
      'any.required': schemaMessages.required(difficulty),
    });
};

const quizCategoryID = (category, int) => {
  const categoryIds = quizValues.CATEGORIES_ID.map((categoryId) => categoryId.id);
  const categoryNames = quizValues.CATEGORIES_ID.map((categorySet) => `[${categorySet.id}] ${categorySet.name}`);
  return quizCategorySchemaObj
    .valid(...categoryIds)
    .required()
    .messages({
      'number.base': schemaMessages.base(category, int),
      'number.min': schemaMessages.min(category, quizValues.CATEGORIES_MIN_MAX.min),
      'number.max': schemaMessages.max(category, quizValues.CATEGORIES_MIN_MAX.max),
      'any.only': schemaMessages.valid(category, categoryNames),
      'any.required': schemaMessages.required(category),
    });
};

// Start date now gets a new date and set the hours to midnight.
// The way .min was working is that it checks the current timestring exactly,
// so by the time you post the date no longer matches the min "expected date"
const quizStartDate = (date, dateType) => {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return JoiDates.date()
    .format('YYYY-MM-DD')
    .min(currentDate)
    .required()
    .messages({
      'date.format': schemaMessages.format(date),
      'date.base': schemaMessages.base(date, dateType),
      'date.min': schemaMessages.min(dateType),
      'any.required': 'Start date is required',
    });
};

// To pass the correct endDate, we pass in the startDate from req.body
// we can then use that to make a new date and add +5 to the days to allow the correct comparisons to work
// Start the validation by creating a new Date and adding 5 days to it before the rest of the validation starts
const quizEndDate = (date, dateType, startDate, reqStartDate) => {
  const endQuizMax = new Date(reqStartDate);
  endQuizMax.setDate(endQuizMax.getDate() + 5);

  return JoiDates.date()
    .format('YYYY-MM-DD')
    .greater(Joi.ref('startDate')) // Using Joi.ref to compare the 'startDate' part of the JoiObject schema
    .max(endQuizMax)
    .required()
    .messages({
      'date.base': schemaMessages.base(date, dateType),
      'date.format': schemaMessages.format(date),
      'date.greater': schemaMessages.greater(date, startDate),
      'date.max': schemaMessages.dateMax(date),
      'any.required': schemaMessages.required(date),
    });
};

const quizQuestionLimit = () => {
  return Joi.number().min(10).max(10).required().messages({
    'number.base': 'totalQuestions should be a number',
    'number.min': 'totalQuestions amount must be 10',
    'number.max': 'totalQuestions amount must be 10',
    'any.required': 'totalQuestions is required',
  });
};

// Using Object.values to get the object data from quizValues consonant to pass as spread ...quizTypes
const quizType = () => {
  const quizTypes = Object.values(quizValues.QUIZ_TYPE);
  return Joi.string()
    .valid(...quizTypes)
    .required()
    .messages({
      'string.base': 'Type should be a string',
      'string.empty': 'Type cannot be empty',
      'any.required': 'Type is required',
      'any.only': `Type must contain either ${quizTypes}`,
    });
};

// Passing the req.body.startDate to use for comparison in the endDate schema
const validateQuiz = (req, res, next) => {
  const quizSchema = Joi.object({
    name: quizName('Quiz name', 'string'),
    difficulty: quizDifficulty('Difficulty', 'string'),
    categoryId: quizCategoryID('CategoryId [id]', 'int'),
    startDate: quizStartDate('Start date', 'string'),
    endDate: quizEndDate('End date', 'string', 'Start Date', req.body.startDate),
    totalQuestions: quizQuestionLimit(),
    type: quizType(),
  });

  const { error } = quizSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }
  next();
};

export default validateQuiz;
