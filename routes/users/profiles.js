import express from 'express';

import { getUser, getUsers, updateUser } from '../../controllers/auth/users/profiles.js';
import auth from '../../middleware/authRoute.js';

const router = express.Router();

router.route('/').get(auth, getUsers);
router.route('/:id').get(auth, getUser).put(auth, updateUser);

export default router;
