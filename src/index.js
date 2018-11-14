// @flow

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import type { $Request, $Response } from 'express';

import catchError from './middleware';
import { initialized, authJwt } from './passport';
import sequelize from './database';

import {
  login,
  register,
  refreshToken,
  changePassword,
  accountInformation,
} from './user';
import { saveJson, retrieveJson } from './files';

const app = express();

// Register middleware
app.use(initialized);
app.use(bodyParser.json());
app.use(cors());

// Change default headers
app.use((req: $Request, res: $Response, next) => {
  res.setHeader('API-Consumer', 'Thyme');
  next();
});

// App status endpoints
app.get('/', (req: $Request, res: $Response) => { res.end('Thyme Capsule is running'); });

// User endpoints
app.post('/register', catchError(400, register));
app.post('/login', catchError(401, login));
app.post('/refresh-token', authJwt, catchError(401, refreshToken));
app.post('/change-password', authJwt, catchError(401, changePassword));
app.get('/account-information', authJwt, catchError(401, accountInformation));

// File endpoints
app.post('/save-state', authJwt, catchError(400, saveJson));
app.get('/get-state', authJwt, catchError(404, retrieveJson));

const port = process.env.PORT || 4000;

// eslint-disable-next-line no-console
app.listen(port, async () => {
  await sequelize.sync();
  console.info(`Server started on port ${port}`);
});
