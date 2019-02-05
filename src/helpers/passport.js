// @flow

import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { User } from '../database';

const options = {
  expiresIn: '21d',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'thyme',
};

const strategy = new Strategy(options, async (payload, next) => {
  const user = await User.findByPk(payload.id);
  next(null, user);
});

passport.use(strategy);

export const sign = (payload: any) => jwt.sign(
  payload,
  options.secretOrKey,
  { expiresIn: options.expiresIn },
);

export const verify = (token: string) => jwt.verify(token, options.secretOrKey);

export const authJwt = passport.authenticate('jwt', { session: false });

export const initialized = passport.initialize();
