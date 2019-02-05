// @flow

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';

import type { $Request, $Response } from 'express';

import setupErrorLogging from './helpers/errorLogging';
import { initialized } from './helpers/passport';
import sequelize from './database';

import connectSocketIO from './middlewares/socket';

import registerRoutes from './routes';

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

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
connectSocketIO(server);

server.listen(port, async () => {
  await sequelize.sync();
  console.info(`Server started on port ${port}`);
});
