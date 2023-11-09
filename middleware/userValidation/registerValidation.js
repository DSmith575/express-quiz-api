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

const registerFirstLastName = (field, string) => {
  return registerFirstLastNameSchemaObj.required().messages({
    'string.base': schemaMessages.base(field, string),
    'string.min': schemaMessages.min(field, registerValues.FIRST_LAST_NAME.min),
    'string.max': schemaMessages.max(field, registerValues.FIRST_LAST_NAME.max),
    'string.pattern.base': schemaMessages.patternAlpha(field),
    'string.empty': schemaMessages.empty(field),
    'any.required': schemaMessages.required(field),
  });
};

const registerUsername = (username, string) => {
  return registerUsernameSchemaObj.required().messages({
    'string.base': schemaMessages.base(username, string),
    'string.min': schemaMessages.min(username, registerValues.USERNAME.min),
    'string.max': schemaMessages.max(username, registerValues.USERNAME.max),
    'string.alphanum': schemaMessages.patternAlphaNum(username),
    'string.empty': schemaMessages.empty(username),
    'any.required': schemaMessages.required(username),
  });
};

// Custom validation to compare username and email
// using Jois value helper arguments, we compare the split req.body.email with the req.body.username
// if it is true the value is returned for validation.
// if false displays a custom helper message error
const registerEmail = (email, string, reqUsername, reqEmail) => {
  const customValidation = (value, helpers) => {
    if ((value = reqEmail.split('@')[0] === reqUsername)) {
      return value;
    }
    return helpers.error('email.unauthorized');
  };

  return emailSchemaObj
    .required()
    .custom(customValidation, 'custom email validation')
    .messages({
      'string.base': schemaMessages.base(email, string),
      'string.email': schemaMessages.email(email),
      'string.empty': schemaMessages.empty(email),
      'any.required': schemaMessages.required(email),
      'email.unauthorized': schemaMessages.unauthorizedEmail(email),
    });
};

const registerPassword = (password, string) => {
  return registerPasswordSchemaObj.required().messages({
    'string.base': schemaMessages.base(password, string),
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
    firstName: registerFirstLastName('First name', 'string'),
    lastName: registerFirstLastName('Last name', 'string'),
    username: registerUsername('Username', 'string'),
    email: registerEmail('Email', 'string', req.body.username, req.body.email),
    password: registerPassword('Password', 'string'),
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
