import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter());

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});

export default app;
