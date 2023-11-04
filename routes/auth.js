/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 *
 * @author Deacon Smith
 *
 * @created 4/11/2023
 * @updated 4/11/2023
 *
 */

import { Router } from 'express';

import { register } from '../controllers/auth.js';

const router = Router();

router.route('/register').post(register);
// router.route("/login").post(login);

export default router;
