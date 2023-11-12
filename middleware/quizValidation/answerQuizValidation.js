import Joi from 'joi';
import JoiDate from '@joi/date';
import { PrismaClient } from '@prisma/client';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

const prisma = new PrismaClient();

// Using @joi/date
// Allows the use of the .format() function on dates to put own fields eg (YYYY-MM-DD)
// We extend the initial Joi import to allow the @joi/date to work with it
const JoiDates = Joi.extend(JoiDate);

// const checkStartDate = (startDate) => {
//     return Joi.date().min(startDate)
// }

// const answerQuizValidation = async (req) => {
//   const currentDate = new Date();
//   const getQuizDates = await prisma.quiz.findFirst({
//     where: { id: Number(req.params.id) },
//   });

//   const { startDate, endDate } = getQuizDates;

//   const startCheck = new Date(startDate);
//   const endCheck = new Date(endDate);

// //   return Joi.date().less(Joi.ref(startCheck)).messages({
// //     'date.less': 'testing',
// //   });

//   //   if (startDate > currentDate) {
//   //     return res.json({
//   //         msg: "Not yet started"
//   //     })
//   //   }

//   //   if (endDate < currentDate) {
//   //     return res.json({
//   //         msg: "ended"
//   //     })
//   //   }
// };

// check if start date is greater than the current date
const quizStartDateValidation = (startDate) => {
  const currentDate = new Date().toISOString().split('T')[0];
  return JoiDates.date().format('YYYY-MM-DD').min(currentDate).greater(startDate).messages({
    'date.min': 'Testing',
    'date.max': 'testing2',
  });
};

const validateQuizAnswer = async (req, res, next) => {
  const quizDates = await prisma.quiz.findFirst({
    where: { id: Number(req.params.id) },
  });

  const { startDate, endDate } = quizDates;

  const answerSchema = Joi.object({
    startDate: quizStartDateValidation(startDate),
    // endDate,
    // answers,
  });

  const { error } = answerSchema.validateAsync();

  if (error) {
    return res.status(400).json({
      statusCode: res.statusCode,
      msg: error.details[0].message,
    });
  }
};

export default validateQuizAnswer;
