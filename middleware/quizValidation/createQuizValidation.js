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

const quizDifficulty = (category) => {
    const diffArray = Object.values(quizValues.CATEGORY_TYPES);
    return Joi.string().valid(...diffArray).required().messages({
        'string.base': schemaMessages.base(category),
        'string.empty': schemaMessages.empty(category),
        'any.only': schemaMessages.valid(category, diffArray),
        'any.required': schemaMessages.required(category)
    });
};



const validateQuiz = (req, res, next) => {
  const quizSchema = Joi.object({
    name: quizName('Quiz name'),
    difficulty: quizDifficulty('Difficulty')
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
