import express from 'express';

import getUser from '../../controllers/auth/users/profiles.js';
import auth from '../../middleware/authRoute.js';

const router = express.Router();

router.get('/:id', auth, getUser);

export default router;
