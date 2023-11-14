/**
* @description A list of reusable messages for Joi schema validation
* @file joiSchemaMessages.js

* @author Deacon Smith
* @created 05/11/2023
* @updated 15/11/2023
*
 * @property {Function} base - Basic validation error message.
 * @property {Function} min - Minimum length validation error message.
 * @property {Function} max - Maximum length validation error message.
 * @property {Function} empty - Empty field validation error message.
 * @property {Function} required - Required field validation error message.
 * @property {Function} email - Email format validation error message.
 * @property {Function} patternAlpha - Validation error message when only alphabetic characters are allowed.
 * @property {Function} patternAlphaNum - Validation error message when only alphanumeric characters are allowed.
 * @property {Function} patternNumSpec - Validation error message when at least one numeric and one special character are required.
 * @property {Function} only - Validation error message when a field does not match the expected value.
 * @property {Function} valid - Validation error message when the field must be one of the specified values.
 * @property {Function} greater - Validation error message when the field must be greater than a specified date.
 * @property {Function} dateMax - Validation error message when the date must be greater than a certain number of days from the start date.
 * @property {Function} dateMin - Validation error message when the date must be greater than or equal to today.
 * @property {Function} format - Validation error message when the field must follow a specific date format.
 * @property {Function} unauthorizedEmail - Validation error message when the field must match the username part of an email.
 * @property {Function} quizOnly - Validation error message when the field must contain specific values.

 * @param {string} fieldName - The name of the field being validated.
 */

const baseValidationMessages = {
  base: (fieldName, type) => `${fieldName} should be a ${type}`,
  min: (fieldName, min) => `${fieldName} should have a minimum length of ${min}`,
  max: (fieldName, max) => `${fieldName} should have a maximum length of ${max}`,
  valid: (fieldName, object) => `${fieldName} must be of the following ${object}`,
  empty: (fieldName) => `${fieldName} should not be empty`,
  required: (fieldName) => `${fieldName} is required`,
  only: (fieldName) => `${fieldName} does not match`,
  patternAlpha: (fieldName) => `${fieldName} should only contain alpha characters`,
};

const registerValidation = {
  email: (fieldName) => `${fieldName} format invalid`,
  patternAlphaNum: (fieldName) => `${fieldName} should only contain alphanumeric characters`,
  patternNumSpec: (fieldName) => `${fieldName} should contain at least one numeric and one special character`,
  unauthorizedEmail: (fieldName) => `${fieldName} must match the username`,
};

const quizValidation = {
  greater: (fieldName, date) =>
    `${fieldName} must be greater than ${date} and no more than 5 days and in string format YYYY-MM-DD`,
  dateMax: (fieldName) =>
    `${fieldName} must be greater than 5 days from the start date. Please make sure date is in string format YYYY-MM-DD`,
  dateMin: (fieldName) => `${fieldName} must be greater than or equal to today in string format YYYY-MM-DD`,
  format: (fieldName) => `${fieldName} must follow the format YYYY-MM-DD`,
  quizOnly: (fieldName, values) => `${fieldName} must contain ${values}`,
};

export { registerValidation, quizValidation, baseValidationMessages };
