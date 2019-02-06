// @flow

import type { $Request, $Response } from 'express';
import bodyParser from 'body-parser';

import currentVersion from './middlewares/version';
import {
  accountInformation,
  changePassword,
  login,
  refreshToken,
  register,
} from './middlewares/user';
import { buySubscription, listSubscriptions, stripeWebhook } from './middlewares/subscription';
import { retrieveJson, saveJson, saveTempItem } from './middlewares/files';

import catchError from './helpers/middleware';
import { authJwt } from './helpers/passport';

export default function registerRoutes(app: express$Application) {
  // App status endpoints
  app.get('/', (req: $Request, res: $Response) => { res.end('Thyme Capsule is running'); });

  // App version endpoint
  app.get('/version', currentVersion);

  // User endpoints
  app.post('/register', catchError(400, register));
  app.post('/login', catchError(401, login));
  app.post('/refresh-token', authJwt, catchError(401, refreshToken));
  app.post('/change-password', authJwt, catchError(401, changePassword));
  app.get('/account-information', authJwt, catchError(401, accountInformation));

  // Subscription endpoints
  app.post('/buy-subscription', authJwt, catchError(401, buySubscription));
  app.get('/list-subscriptions', authJwt, catchError(401, listSubscriptions));
  app.all('/stripe', bodyParser.raw({ type: '*/*' }), stripeWebhook);

  // File endpoints
  app.post('/save-state', authJwt, catchError(400, saveJson));
  app.get('/get-state', authJwt, catchError(404, retrieveJson));
  app.post('/save-temporary', authJwt, catchError(400, saveTempItem));
}
