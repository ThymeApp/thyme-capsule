import express from 'express';
import bodyParser from 'body-parser';

import { passport } from './passport';
import { login, register } from './user';

const app = express();

app.use(passport.initialize());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Running');
});

app.post('/login', login);
app.post('/register', register);

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started');
});
