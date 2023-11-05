import Joi from 'joi';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';

const loginUsername = (username) => {
  return Joi.string().messages({
    'string.base': schemaMessages.base(username),
    'string.empty': schemaMessages.empty(username),
  });
};

const loginEmail = (email) => {
  return Joi.string().messages({
    'string.base': schemaMessages.base(email),
    'string.empty': schemaMessages.empty(email),
    'string.email': schemaMessages.email(email),
  });
};

const loginPassword = (password) => {
  return Joi.string()
    .required()
    .messages({
      'string.base': schemaMessages.base(password),
      'string.empty': schemaMessages.empty(password),
      'any.required': schemaMessages.required(password),
    });
};

const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: loginUsername('Username'),
    email: loginEmail('Email'),
    password: loginPassword('Password'),
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
