/**
 * @description Auth route that handles the auth.js controller
 * @file auth.js
 * @author Deacon Smith
 * @created 04/11/2023
 * @updated 15/11/2023
 */

import express from 'express';
import register from '../../controllers/auth/login-register/authRegister.js';
import login from '../../controllers/auth/login-register/authLogin.js';
import registerValidate from '../../middleware/userValidation/registerValidation.js';
import loginValidate from '../../middleware/userValidation/loginValidation.js';
import auth from '../../middleware/authRoute.js';
import seedBasicUsers from '../../controllers/auth/login-register/authBasicUserSeed.js';
import { deleteAllBasicUsers } from '../../controllers/auth/users/profiles.js';

const router = express.Router();

router.route('/register').post(registerValidate, register);
router.route('/login').post(loginValidate, login);
router.route('/seed-basic-users').post(auth, seedBasicUsers);
router.route('/delete-basic-users').delete(auth, deleteAllBasicUsers);

export default router;
