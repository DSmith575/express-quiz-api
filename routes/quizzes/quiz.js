/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 12/11/2023
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
import { joinQuiz, answerQuiz } from '../../controllers/auth/quizzes/joinQuiz.js';
import validateQuizAnswer from '../../middleware/quizValidation/answerQuizValidation.js';

const router = express.Router();

router.route('/').get(auth, getAllQuizzes);
router.route('/past').get(auth, getPastQuizzes);
router.route('/present').get(auth, getPresentQuizzes);
router.route('/future').get(auth, getFutureQuizzes);
router.route('/create').post(auth, validateQuiz, createQuiz);
router.route('/delete/:id').delete(auth, deleteQuiz);
router.route('/:id').get(auth, getQuiz);
router.route('/:id/join').get(auth, joinQuiz);
router.route('/:id/answer').post(auth, validateQuizAnswer, answerQuiz);

export default router;
