/**
 * @description Main entry point
 * @file index.js
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 12/11/2023
 */

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cacheRoute from './middleware/cacheRoute.js';

import auth from './routes/login-register/auth-process.js';
import profile from './routes/users/profiles.js';
import quiz from './routes/quizzes/quiz.js';
import urlPath from './utils/consonants/globalConsonants.js';

const { PORT } = process.env;

// index Paths located in the globalConsonants.js file (api/versionNumber)
const BASE_PATH = `/${urlPath.INDEX_PATHS.BASE_URL}/${urlPath.INDEX_PATHS.CURRENT_VERSION}`;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(compression());
app.use(cacheRoute);

app.use(`${BASE_PATH}/auth`, auth);
app.use(`${BASE_PATH}/auth/users`, profile);
app.use(`${BASE_PATH}/auth/quizzes`, quiz);

// When attempting to connect to path without /api/v1 will display the correct route
app.get('/', (req, res) => {
  return res.json({
    endpoints: [`${BASE_PATH}`],
  });
});

// returns a list of endpoints when attempting to connect to /api/v1
app.get(`${BASE_PATH}`, (req, res) => {
  return res.json({
    endpoints: [
      `[POST] ${BASE_PATH}/auth/register`,
      `[POST] ${BASE_PATH}/auth/login`,
      `[GET] ${BASE_PATH}/auth/users`,
      `[GET] ${BASE_PATH}/auth/users/{id}`,
      `[GET] ${BASE_PATH}/auth/quizzes`,
      `[POST] ${BASE_PATH}/auth/quizzes/create`,
      `[DELETE] ${BASE_PATH}/auth/quizzes/delete/{id}`,
      `[GET] ${BASE_PATH}/auth/quizzes/past`,
      `[GET] ${BASE_PATH}/auth/quizzes/present`,
      `[GET] ${BASE_PATH}/auth/quizzes/future`,
      `[GET] ${BASE_PATH}/auth/quizzes/{id}`,
      `[POST] ${BASE_PATH}/auth/quizzes/{id}/join`,
      `[POST] ${BASE_PATH}/auth/quizzes/{id}/answers`,
      `[GET] ${BASE_PATH}/auth/quizzes/scores`,
      `[GET] ${BASE_PATH}/auth/quizzes/{id}/scores`,
      `[POST] ${BASE_PATH}/auth/seed-basic-users`,
      `[DELETE] ${BASE_PATH}/auth/delete-basic-users`,
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
