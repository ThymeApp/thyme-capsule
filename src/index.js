import express from 'express';
import bodyParser from 'body-parser';

import catchError from './middleware';
import { initialized, authJwt } from './passport';
import { login, register } from './user';

const app = express();

// Register middleware
app.use(initialized);
app.use(bodyParser.json());

// User endpoints
app.post('/register', catchError(400, register));
app.post('/login', catchError(401, login));

//
app.get('/secret', authJwt, (req, res) => {
  res.json({ message: 'success' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => { console.info(`Server started on port ${port}`); });
