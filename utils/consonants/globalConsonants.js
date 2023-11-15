/**
 * @description Util file for storing global Consts
 * @file globalConsonants.js
 *
 * @author Deacon Smith
 * @created 12-11-2023
 * @updated 15-11-2023
 */

const INDEX_PATHS = {
  BASE_URL: 'api',
  CURRENT_VERSION: 'v1',
};

const USER_ROLES = {
  basic: 'BASIC_USER',
  super: 'SUPER_ADMIN_USER',
};

const QUIZ_AVERAGE = {
  calculate: 100,
};

const QUIZ_DATE_CHECK = {
  notStarted: 'quizNotStarted',
  ended: 'quizEnded',
  ongoing: 'onGoing',
};

export default { USER_ROLES, INDEX_PATHS, QUIZ_AVERAGE, QUIZ_DATE_CHECK };
