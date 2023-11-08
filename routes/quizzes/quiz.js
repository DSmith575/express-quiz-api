/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 5/11/2023
 */

import express from 'express';
import validateQuiz from '../../middleware/quizValidation/createQuizValidation.js';
import { createQuiz, deleteQuiz, getQuiz } from '../../controllers/auth/quizzes/quizzes.js';
import auth from '../../middleware/authRoute.js';

const router = express.Router();

// router.route('/').get(createQuiz);
router.route('/create').post(auth, validateQuiz, createQuiz);
router.route('/delete/:id').delete(auth, deleteQuiz);
router.route('/:id').get(getQuiz);

export default router;
