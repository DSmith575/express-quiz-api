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
    .format(quizValues.QUIZ_DATES.format)
    .min(currentDate)
    .required()
    .messages({
      'date.format': schemaMessages.format(date),
      'date.base': schemaMessages.base(date, dateType),
      'date.min': schemaMessages.min(dateType),
      'any.required': schemaMessages.required(date),
    });
};

// To pass the correct endDate, we pass in the startDate from req.body
// we can then use that to make a new date and add +5 to the days to allow the correct comparisons to work
// Start the validation by creating a new Date and adding 5 days to it before the rest of the validation starts
const quizEndDate = (date, dateType, startDate, reqStartDate) => {
  const endQuizMax = new Date(reqStartDate);
  endQuizMax.setDate(endQuizMax.getDate() + quizValues.QUIZ_DATES.addFive);

  return JoiDates.date()
    .format(quizValues.QUIZ_DATES.format)
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

const quizQuestionLimit = (qLimit, qLimitType) => {
  return Joi.number()
    .min(quizValues.QUIZ_QUESTIONS.required)
    .max(quizValues.QUIZ_QUESTIONS.required)
    .required()
    .messages({
      'number.base': schemaMessages.base(qLimit, qLimitType),
      'number.min': schemaMessages.min(qLimit, quizValues.QUIZ_QUESTIONS.required),
      'number.max': schemaMessages.max(qLimit, quizValues.QUIZ_QUESTIONS.required),
      'any.required': schemaMessages.required(qLimit),
    });
};

// Using Object.values to get the object data from quizValues consonant to pass as spread ...quizTypes
const quizType = (type, qType) => {
  const quizTypes = Object.values(quizValues.QUIZ_TYPE);
  return Joi.string()
    .valid(...quizTypes)
    .required()
    .messages({
      'string.base': schemaMessages.base(type, qType),
      'string.empty': schemaMessages.empty(type),
      'any.required': schemaMessages.required(type),
      'any.only': schemaMessages.quizOnly(type, quizTypes),
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
    totalQuestions: quizQuestionLimit('QuestionLimit', 'number'),
    type: quizType('Type', 'string'),
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
