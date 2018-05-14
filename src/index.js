import express from 'express';
import bodyParser from 'body-parser';

import { initialized, authJwt } from './passport';
import { login, register } from './user';

const app = express();

// Register middleware
app.use(initialized);
app.use(bodyParser.json());

// User endpoints
app.post('/register', register);
app.post('/login', login);

//
app.get('/secret', authJwt, (req, res) => {
  res.json({ message: 'success' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => { console.info(`Server started on port ${port}`); });
