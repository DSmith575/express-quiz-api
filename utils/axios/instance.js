/**
 * @description Axios Instance for env URLs
 * @file instance.js
 *
 * @author Deacon Smith
 *
 *
 * @return {Prop} baseURL - Creates baseURL with env URL
 *
 * @created 14-11-2023
 * @updated 14-11-2023
 */

import axios from 'axios';

const GIST_URL = process.env.GIT_GIST_URL;
const QUIZ_URL = process.env.QUIZ_DATABASE;

export const seedGist = axios.create({
  baseURL: GIST_URL,
});

export const quizCreate = axios.create({
  baseURL: QUIZ_URL,
});
