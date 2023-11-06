import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';
import quizValues from '../../utils/consonants/quizConsonants.js';

const quizNameSchemaObj = Joi.string()
  .min(quizValues.QUIZ_NAME.min)
  .max(quizValues.QUIZ_NAME.max)
  .pattern(quizValues.QUIZ_NAME.pattern);

const quizName = (name) => {
  return quizNameSchemaObj.required().messages({
    'string.base': schemaMessages.base(name),
    'string.min': schemaMessages.min(name, quizValues.QUIZ_NAME.min),
    'string.max': schemaMessages.max(name, quizValues.QUIZ_NAME.max),
    'string.pattern.base': schemaMessages.patternAlpha(name),
    'string.empty': schemaMessages.empty(name),
    'any.required': schemaMessages.required(name),
  });
};

const validateQuiz = (req, res, next) => {
  const quizSchema = Joi.object({
    name: quizName('Quiz name'),
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
