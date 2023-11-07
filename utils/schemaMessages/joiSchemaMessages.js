/**
* @description Joi schema validation messages
* @file joiSchemaMessages.js
* @author Deacon Smith
* @created 5/11/2023
* @updated 5/11/2023
*
* @property {Function} base - A template for a basic validation error message.
* @property {Function} min - A template for a minimum length validation error message.
* @property {Function} max - A template for a maximum length validation error message.
* @property {Function} empty - A template for an empty field validation error message.
* @property {Function} required - A template for a required field validation error message.
* @property {Function} email - A template for an email format validation error message.
* @property {Function} patternAlpha - A template for a validation error message when only alphabetic characters are allowed.
* @property {Function} patternAlphaNum - A template for a validation error message when only alphanumeric characters are allowed.
* @property {Function} patternNumSpec - A template for a validation error message when at least one numeric and one special character are required.
* @property {Function} only - A template for a validation error message when a field does not match the expected value.

* @param {string} fieldName - The name of the field being validated.
* @param {number} min - The minimum length required.
* @param {number} max - The maximum length allowed.
*/

const validationMessages = {
  base: (fieldName, type) => `${fieldName} should be a ${type}`,
  email: (fieldName) => `${fieldName} format invalid`,
  min: (fieldName, min) => `${fieldName} should have a minimum length of ${min}`,
  max: (fieldName, max) => `${fieldName} should have a maximum length of ${max}`,
  empty: (fieldName) => `${fieldName} should not be empty`,
  required: (fieldName) => `${fieldName} is required`,
  only: (fieldName) => `${fieldName} does not match`,
  patternAlpha: (fieldName) => `${fieldName} should only contain alpha characters`,
  patternAlphaNum: (fieldName) => `${fieldName} should only contain alphanumeric characters`,
  patternNumSpec: (fieldName) => `${fieldName} should contain at least one numeric and one special character`,
  valid: (fieldName, object) => `${fieldName} must be of the following ${object}`,
};

export default validationMessages;
