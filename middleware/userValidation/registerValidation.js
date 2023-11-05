import Joi from 'joi';
import registerValues from '../../utils/consonants/registerConsonants.js';
import schemaMessages from '../../utils/schemaMessages/joiSchemaMessages.js';

const registerFirstLastNameSchemaObj = Joi.string()
  .min(registerValues.FIRST_LAST_NAME.min)
  .max(registerValues.FIRST_LAST_NAME.max)
  .pattern(registerValues.FIRST_LAST_NAME.pattern);

const registerUsernameSchemaObj = Joi.string().min(registerValues.USERNAME.min).max(registerValues.USERNAME.max).alphanum();

const emailSchemaObj = Joi.string().email({ tlds: { allow: true } });

const registerPasswordSchemaObj = Joi.string()
  .min(registerValues.PASSWORD.min)
  .max(registerValues.PASSWORD.max)
  .pattern(registerValues.PASSWORD.pattern);

const registerFirstLastName = (field) => {
  return registerFirstLastNameSchemaObj.required().messages({
    'string.base': schemaMessages.base(field),
    'string.min': schemaMessages.min(field, registerValues.FIRST_LAST_NAME.min),
    'string.max': schemaMessages.max(field, registerValues.FIRST_LAST_NAME.max),
    'string.pattern.base': schemaMessages.patternAlpha(field),
    'string.empty': schemaMessages.empty(field),
    'any.required': schemaMessages.required(field),
  });
};

const registerUsername = (username) => {
  return registerUsernameSchemaObj.required().messages({
    'string.base': schemaMessages.base(username),
    'string.min': schemaMessages.min(username, registerValues.USERNAME.min),
    'string.max': schemaMessages.max(username, registerValues.USERNAME.max),
    'string.alphanum': schemaMessages.patternAlphaNum(username),
    'string.empty': schemaMessages.empty(username),
    'any.required': schemaMessages.required(username),
  });
};

const registerEmail = (email) => {
  return emailSchemaObj.required().messages({
    'string.base': schemaMessages.base(email),
    'string.email': schemaMessages.email(email),
    'string.empty': schemaMessages.empty(email),
    'any.required': schemaMessages.required(email),
  });
};

const registerPassword = (password) => {
  return registerPasswordSchemaObj.required().messages({
    'string.base': schemaMessages.base(password),
    'string.min': schemaMessages.min(password, registerValues.PASSWORD.min),
    'string.max': schemaMessages.max(password, registerValues.PASSWORD.max),
    'string.pattern.base': schemaMessages.patternNumSpec(password),
    'string.empty': schemaMessages.empty(password),
    'any.required': schemaMessages.required(password),
  });
};

const confirmPassword = (password) => {
  return Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': schemaMessages.only(password),
      'any.required': schemaMessages.required(password),
    });
};

const validateRegister = (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: registerFirstLastName('First name'),
    lastName: registerFirstLastName('Last name'),
    username: registerUsername('Username'),
    email: registerEmail('Email'),
    password: registerPassword('Password'),
    confirmPassword: confirmPassword('Confirm Password'),
    role: Joi.string().valid('BASIC_USER', 'SUPER_ADMIN_USER'),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export default validateRegister;
