import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

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

// Date uses non NZ time, so day -1 works
const quizStartDate = (date, dateType) => {
  return Joi.date()
    .min(new Date().toISOString().split('T')[0]) // Start date must be greater than or equal to today Converting input to ISO and returning the first half of the array (date)
    .required()
    .messages({
      'date.base': schemaMessages.base(date, dateType),
      'date.min': 'Start date must be greater than or equal to today in string format YYYY-MM-DD',
      'date.max': 'Start date must be before or equal to the end date',
      'any.required': 'Start date is required',
    });
};

const quizEndDate = (date, startDate, dateType) => {
  const maxEndDate = new Date();
  maxEndDate.setDate(maxEndDate.getDate() + 5); // Calculate maximum end date (5 days from today)

  return Joi.date()
    .greater(Joi.ref('startDate')) // End date must be greater than the start date
    .max(maxEndDate.toISOString().split('T')[0]) // End date must be no longer than five days from the start date
    .required()
    .messages({
      'date.base': schemaMessages.base(date, startDate),
      'date.greater': schemaMessages.greater(date, dateType),
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

const validateQuiz = (req, res, next) => {
  const quizSchema = Joi.object({
    name: quizName('Quiz name', 'string'),
    difficulty: quizDifficulty('Difficulty', 'string'),
    categoryId: quizCategoryID('CategoryId [id]', 'int'),
    startDate: quizStartDate('Start date', 'string format YYYY-MM-DD'),
    endDate: quizEndDate('End date', 'string format YYYY-MM-DD', 'Start Date'),
    totalQuestions: quizQuestionLimit(),
    questionType: quizType(),
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
