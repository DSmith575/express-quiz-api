import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

// const test = '2011-12-23'
// const newDate = new Date(test);
// const returnedISO = newDate.toISOString().split("T")[0]

// const endDate = new Date(newDate);
// endDate.setDate(newDate.getDate() + 5);
// console.log(endDate.toISOString().split("T")[0])
// console.log(returnedISO)

// const test = Object.values(quizValues.CATEGORY_TYPES);
// console.log(...test)

// console.log(quizValues.CATEGORIES_ID)

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
  const categoryIds = quizValues.CATEGORIES_ID.map((category) => category.id);
  const categoryNames = quizValues.CATEGORIES_ID.map((category) => `[${category.id}] ${category.name}`);
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

const validateQuiz = (req, res, next) => {
  const quizSchema = Joi.object({
    name: quizName('Quiz name', 'string'),
    difficulty: quizDifficulty('Difficulty', 'string'),
    categoryId: quizCategoryID('CategoryId', 'int'),
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
