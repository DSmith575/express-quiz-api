/**
 * @description Joi validation for creating a quiz
 * @file createQuizValidation.js
 *
 * @function quizName Quiz name validation
 * @function quizDifficulty Quiz difficulty validation
 * @function quizCategoryID Quiz categoryId validation
 * @function quizStartDate Quiz start date validation
 * @function quizEndDate Quiz end date validation
 * @function quizQuestionLimit Quiz total questions validation
 * @function quizType Quiz type validation
 * @function validateQuiz Main Joi object for validating all fields
 *
 * @author Deacon Smith
 * @created 06-11-2023
 * @updated 15-11-2023
 */

import Joi from 'joi';
import JoiDate from '@joi/date';
import { baseValidationMessages, quizValidation } from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

// Using @joi/date
// Allows the use of the .format() function on dates to put own fields eg (YYYY-MM-DD)
// We extend the initial Joi import to allow the @joi/date to work with it
const JoiDates = Joi.extend(JoiDate);

const quizName = (name, string) => {
  return Joi.string()
    .min(quizValues.QUIZ_NAME.min)
    .max(quizValues.QUIZ_NAME.max)
    .pattern(quizValues.QUIZ_NAME.pattern)
    .required()
    .messages({
      'string.base': baseValidationMessages.base(name, string),
      'string.min': baseValidationMessages.min(name, quizValues.QUIZ_NAME.min),
      'string.max': baseValidationMessages.max(name, quizValues.QUIZ_NAME.max),
      'string.pattern.base': baseValidationMessages.patternAlpha(name),
      'string.empty': baseValidationMessages.empty(name),
      'any.required': baseValidationMessages.required(name),
    });
};

const quizDifficulty = (difficulty, string) => {
  const diffArray = Object.values(quizValues.CATEGORY_DIFFICULTY);
  return Joi.string()
    .valid(...diffArray)
    .required()
    .messages({
      'string.base': baseValidationMessages.base(difficulty, string),
      'string.empty': baseValidationMessages.empty(difficulty),
      'any.only': baseValidationMessages.valid(difficulty, diffArray),
      'any.required': baseValidationMessages.required(difficulty),
    });
};
// Map the categoryIDS from quizValues then turn into values of [id] name for the res message if an error occurs during categoryID
const quizCategoryID = (category, int) => {
  const categoryIds = quizValues.CATEGORIES_ID.map((categoryId) => categoryId.id);
  const categoryNames = quizValues.CATEGORIES_ID.map((categorySet) => `[${categorySet.id}] ${categorySet.name}`);
  return Joi.number()
    .min(quizValues.CATEGORIES_MIN_MAX.min)
    .max(quizValues.CATEGORIES_MIN_MAX.max)
    .valid(...categoryIds)
    .required()
    .messages({
      'number.base': baseValidationMessages.base(category, int),
      'number.min': baseValidationMessages.min(category, quizValues.CATEGORIES_MIN_MAX.min),
      'number.max': baseValidationMessages.max(category, quizValues.CATEGORIES_MIN_MAX.max),
      'any.only': baseValidationMessages.valid(category, categoryNames),
      'any.required': baseValidationMessages.required(category),
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
      'date.format': quizValidation.format(date),
      'date.base': baseValidationMessages.base(date, dateType),
      'date.min': quizValidation.dateMin(date),
      'any.required': baseValidationMessages.required(date),
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
      'date.base': baseValidationMessages.base(date, dateType),
      'date.format': quizValidation.format(date),
      'date.greater': quizValidation.greater(date, startDate),
      'date.max': quizValidation.dateMax(date),
      'any.required': baseValidationMessages.required(date),
    });
};

const quizQuestionLimit = (qLimit, qLimitType) => {
  return Joi.number()
    .min(quizValues.QUIZ_QUESTIONS.required)
    .max(quizValues.QUIZ_QUESTIONS.required)
    .required()
    .messages({
      'number.base': baseValidationMessages.base(qLimit, qLimitType),
      'number.min': baseValidationMessages.min(qLimit, quizValues.QUIZ_QUESTIONS.required),
      'number.max': baseValidationMessages.max(qLimit, quizValues.QUIZ_QUESTIONS.required),
      'any.required': baseValidationMessages.required(qLimit),
    });
};

// Using Object.values to get the object data from quizValues consonant to pass as spread ...quizTypes
const quizType = (type, qType) => {
  const quizTypes = Object.values(quizValues.QUIZ_TYPE);
  return Joi.string()
    .valid(...quizTypes)
    .required()
    .messages({
      'string.base': baseValidationMessages.base(type, qType),
      'string.empty': baseValidationMessages.empty(type),
      'any.required': baseValidationMessages.required(type),
      'any.only': quizValidation.quizOnly(type, quizTypes),
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
    totalQuestions: quizQuestionLimit('Total Questions', 'number'),
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
