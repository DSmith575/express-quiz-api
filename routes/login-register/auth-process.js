/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 5/11/2023
 */

import { Router } from 'express';
import register from '../../controllers/auth/login-register/authRegister.js';
import login from '../../controllers/auth/login-register/authLogin.js';
import registerValidate from '../../middleware/userValidation/registerValidation.js';
import loginValidate from '../../middleware/userValidation/loginValidation.js';

const router = Router();

router.route('/register').post(registerValidate, register);
router.route('/login').post(loginValidate, login);

export default router;
