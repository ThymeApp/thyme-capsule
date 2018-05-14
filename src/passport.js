import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { User } from './database';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'thyme',
};

const strategy = new Strategy(options, async (payload, next) => {
  const user = await User.findById(payload.id);
  next(null, user);
});

passport.use(strategy);

export const sign = payload => jwt.sign(payload, options.secretOrKey);

export const authJwt = passport.authenticate('jwt', { session: false });

export const initialized = passport.initialize();
