/**
 * @description Endpoint routes that handles the quiz.js controller
 * @file quiz.js
 *
 * @author Deacon Smith
 * @created 05/11/2023
 * @updated 15/11/2023
 */

import express from 'express';
import validateQuiz from '../../middleware/quizValidation/createQuizValidation.js';
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getPastQuizzes,
  getPresentQuizzes,
  getFutureQuizzes,
  getQuiz,
} from '../../controllers/auth/quizzes/quizzes.js';
import auth from '../../middleware/authRoute.js';
import { joinQuiz, answerQuiz } from '../../controllers/auth/quizzes/joinQuizzes.js';
import validateAnswers from '../../middleware/quizValidation/userAnswerValidation.js';
import { getScore, getScores } from '../../controllers/auth/quizzes/scores.js';

const router = express.Router();

router.route('/').get(auth, getAllQuizzes);
router.route('/past').get(auth, getPastQuizzes);
router.route('/present').get(auth, getPresentQuizzes);
router.route('/future').get(auth, getFutureQuizzes);
router.route('/create').post(auth, validateQuiz, createQuiz);
router.route('/delete/:id').delete(auth, deleteQuiz);
router.route('/scores').get(auth, getScores);
router.route('/:id').get(auth, getQuiz);
router.route('/:id/join').get(auth, joinQuiz);
router.route('/:id/answer').post(auth, validateAnswers, answerQuiz);
router.route('/:id/scores').get(auth, getScore);

export default router;
