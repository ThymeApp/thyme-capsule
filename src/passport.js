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

export function sign(payload) {
  return jwt.sign(payload, options.secretOrKey);
}

export { passport };
