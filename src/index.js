// @flow

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import type { $Request, $Response } from 'express';

import setupErrorLogging from './helpers/errorLogging';
import { initialized } from './helpers/passport';
import sequelize from './database';

import registerRoutes from './routes';

const app = express();

// Register middleware
app.use(initialized);
app.use(cors({ exposedHeaders: 'API-Consumer' }));
setupErrorLogging(app);

// Parse body for every path but /stripe
app.use(/^\/(?!stripe).+/, bodyParser.json({ limit: '5mb' }));

// Change default headers
app.use((req: $Request, res: $Response, next) => {
  res.setHeader('API-Consumer', 'Thyme');
  next();
});

registerRoutes(app);

const port = process.env.PORT || 4000;

// eslint-disable-next-line no-console
app.listen(port, async () => {
  await sequelize.sync();
  console.info(`Server started on port ${port}`);
});
