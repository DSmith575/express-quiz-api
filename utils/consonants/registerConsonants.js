/**
* @description Joi schema validation messages
* @file registerConsonants.js
* @author Deacon Smith
* @created 5/11/2023
* @updated 5/11/2023
* 
 * @property {number} min - The minimum length allowed for the field.
 * @property {number} max - The maximum length allowed for the field.
 * @property {RegExp} pattern - A regular expression pattern that the field should match
 * @property {RegExp} pattern - A regular expression pattern to enforce password complexity.
 */

const FIRST_LAST_NAME = {
  min: 2,
  max: 50,
  pattern: /^[A-Za-z]+$/,
};

const USERNAME = {
  min: 5,
  max: 10,
};

const PASSWORD = {
  min: 8,
  max: 16,
  pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])\S+$/,
};

export default { FIRST_LAST_NAME, USERNAME, PASSWORD };
