import express from 'express';
import bodyParser from 'body-parser';

import { passport, sign } from './passport';

const app = express();

app.use(passport.initialize());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Running');
});

app.post('/login', (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(401).json({ message: 'Missing username / password in request' });
  }

  return null;
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started');
});
