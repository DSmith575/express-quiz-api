/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 5/11/2023
 */

import express from 'express';
import validateQuiz from '../../middleware/quizValidation/createQuizValidation.js';
import { createQuiz, deleteQuiz, getAllQuizzes, getPastQuizzes, getPresentQuizzes, getQuiz } from '../../controllers/auth/quizzes/quizzes.js';
import auth from '../../middleware/authRoute.js';

const router = express.Router();

// router.route('/').get(createQuiz);
router.route('/').get(auth, getAllQuizzes);
router.route('/present').get(auth, getPresentQuizzes);
router.route('/past').get(auth, getPastQuizzes);
router.route('/create').post(auth, validateQuiz, createQuiz);
router.route('/delete/:id').delete(auth, deleteQuiz);
router.route('/:id').get(auth, getQuiz);


export default router;
