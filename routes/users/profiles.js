import express from 'express';

import { getUser, getUsers } from '../../controllers/auth/users/profiles.js';
import auth from '../../middleware/authRoute.js';

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);

export default router;
