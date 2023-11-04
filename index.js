/**
 * @description Main entry point
 * @file index.js
 *
 * @author Deacon Smith
 *
 * @created 4/11/2023
 * @updated 4/11/2023
 *
 */

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import auth from './routes/auth.js';
import validateRegister from './middleware/registerValidation.js';

const { PORT } = process.env;
const BASE_URL = 'api';
const CURRENT_VERSION = 'v1';
const BASE_PATH = `/${BASE_URL}/${CURRENT_VERSION}`;

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

app.use(`${BASE_PATH}/auth`, validateRegister, auth);
// app.use(`${BASE_PATH}/auth`)

app.get('/', (req, res) => {
  return res.json({
    endpoints: [`${BASE_PATH}`],
  });
});

app.get(`${BASE_PATH}`, (req, res) => {
  return res.json({
    endpoints: [`${BASE_PATH}/auth/register`],
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
