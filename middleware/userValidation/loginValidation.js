import Joi from 'joi';
import { baseValidationMessages, registerValidation } from '../../utils/schemaMessages/joiSchemaMessages.js';

const loginUsername = (username, string) => {
  return Joi.string().messages({
    'string.base': baseValidationMessages.base(username, string),
    'string.empty': baseValidationMessages.empty(username),
  });
};

const loginEmail = (email, string) => {
  return Joi.string().messages({
    'string.base': baseValidationMessages.base(email, string),
    'string.empty': baseValidationMessages.empty(email),
    'string.email': registerValidation.email(email),
  });
};

const loginPassword = (password, string) => {
  return Joi.string()
    .required()
    .messages({
      'string.base': baseValidationMessages.base(password, string),
      'string.empty': baseValidationMessages.empty(password),
      'any.required': baseValidationMessages.required(password),
    });
};

const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: loginUsername('Username', 'string'),
    email: loginEmail('Email', 'string'),
    password: loginPassword('Password', 'string'),
  });

  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export default validateLogin;
