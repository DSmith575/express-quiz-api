import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

const questionTotal = quizValues.QUIZ_QUESTIONS.required;

const validateAnswers = (req, res, next) => {
  const answerSchema = Joi.array()
    .min(questionTotal)
    .max(questionTotal)
    .required()
    .messages({
      'array.base': schemaMessages.base('Answers', 'array format [a1, a2, ... a10]'),
      'array.empty': schemaMessages.empty('Answers'),
      'array.min': schemaMessages.min('Answers', questionTotal),
      'array.max': schemaMessages.max('Answers', questionTotal),
    });

  const { error } = answerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export default validateAnswers;
