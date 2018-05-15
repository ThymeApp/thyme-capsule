// @flow

import express from 'express';
import bodyParser from 'body-parser';

import catchError from './middleware';
import { initialized, authJwt } from './passport';
import { login, register, refreshToken } from './user';

const app = express();

// Register middleware
app.use(initialized);
app.use(bodyParser.json());

// User endpoints
app.post('/register', catchError(400, register));
app.post('/login', catchError(401, login));
app.post('/refresh-token', authJwt, catchError(401, refreshToken));

const port = process.env.PORT || 4000;

// eslint-disable-next-line no-console
app.listen(port, () => { console.info(`Server started on port ${port}`); });
