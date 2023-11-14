/**
 * @description Joi validation registering users
 * @file registerValidation.js
 *
 * @function registerFirstLastName Validation for first and last name
 * @function registerUsername Validation for username
 * @function registerEmail Validation for email
 * @function registerPassword Validation for password
 * @function confirmPassword Validation for comparing password to confirm password
 * @function validateRegister Main Joi Object for validating registration
 *
 * @author Deacon Smith
 * @created 04-11-2023
 * @updated 15-11-2023
 */

import Joi from 'joi';
import registerValues from '../../utils/consonants/registerConsonants.js';
import { registerValidation, baseValidationMessages } from '../../utils/schemaMessages/joiSchemaMessages.js';

const registerFirstLastName = (field, string) => {
  return Joi.string()
    .min(registerValues.FIRST_LAST_NAME.min)
    .max(registerValues.FIRST_LAST_NAME.max)
    .pattern(registerValues.FIRST_LAST_NAME.pattern)
    .required()
    .messages({
      'string.base': baseValidationMessages.base(field, string),
      'string.min': baseValidationMessages.min(field, registerValues.FIRST_LAST_NAME.min),
      'string.max': baseValidationMessages.max(field, registerValues.FIRST_LAST_NAME.max),
      'string.pattern.base': baseValidationMessages.patternAlpha(field),
      'string.empty': baseValidationMessages.empty(field),
      'any.required': baseValidationMessages.required(field),
    });
};

const registerUsername = (username, string) => {
  return Joi.string()
    .min(registerValues.USERNAME.min)
    .max(registerValues.USERNAME.max)
    .alphanum()
    .required()
    .messages({
      'string.base': baseValidationMessages.base(username, string),
      'string.min': baseValidationMessages.min(username, registerValues.USERNAME.min),
      'string.max': baseValidationMessages.max(username, registerValues.USERNAME.max),
      'string.alphanum': registerValidation.patternAlphaNum(username),
      'string.empty': baseValidationMessages.empty(username),
      'any.required': baseValidationMessages.required(username),
    });
};

// Custom validation to compare username and email
// using Jois value helper arguments, we compare the split the value of the emailValidation("email" from body) with the req.body.username
// if it is true the value is returned for validation.
// if false displays a custom helpers message error
const registerEmail = (email, string, reqUsername) => {
  const customValidation = (value, helpers) => {
    if (value.split('@')[0] === reqUsername) {
      return value;
    }
    return helpers.error('email.unauthorized');
  };

  return Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .custom(customValidation, 'custom email validation')
    .messages({
      'string.base': baseValidationMessages.base(email, string),
      'string.email': registerValidation.email(email),
      'string.empty': baseValidationMessages.empty(email),
      'any.required': baseValidationMessages.required(email),
      'email.unauthorized': registerValidation.unauthorizedEmail(email),
    });
};

const registerPassword = (password, string) => {
  return Joi.string()
    .min(registerValues.PASSWORD.min)
    .max(registerValues.PASSWORD.max)
    .pattern(registerValues.PASSWORD.pattern)
    .required()
    .messages({
      'string.base': baseValidationMessages.base(password, string),
      'string.min': baseValidationMessages.min(password, registerValues.PASSWORD.min),
      'string.max': baseValidationMessages.max(password, registerValues.PASSWORD.max),
      'string.pattern.base': registerValidation.patternNumSpec(password),
      'string.empty': baseValidationMessages.empty(password),
      'any.required': baseValidationMessages.required(password),
    });
};

const confirmPassword = (password) => {
  return Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': baseValidationMessages.only(password),
      'any.required': baseValidationMessages.required(password),
    });
};

const validateRegister = (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: registerFirstLastName('First name', 'string'),
    lastName: registerFirstLastName('Last name', 'string'),
    username: registerUsername('Username', 'string'),
    email: registerEmail('Email', 'string', req.body.username),
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
