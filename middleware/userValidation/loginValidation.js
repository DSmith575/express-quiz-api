import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';

const loginUsername = (username, string) => {
  return Joi.string().messages({
    'string.base': schemaMessages.base(username, string),
    'string.empty': schemaMessages.empty(username),
  });
};

const loginEmail = (email, string) => {
  return Joi.string().messages({
    'string.base': schemaMessages.base(email, string),
    'string.empty': schemaMessages.empty(email),
    'string.email': schemaMessages.email(email),
  });
};

const loginPassword = (password, string) => {
  return Joi.string()
    .required()
    .messages({
      'string.base': schemaMessages.base(password, string),
      'string.empty': schemaMessages.empty(password),
      'any.required': schemaMessages.required(password),
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
