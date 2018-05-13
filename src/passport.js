import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'thyme',
};

const strategy = new Strategy(options, (payload, next) => {
  // check payload
  // next(err, user);
});

passport.use(strategy);

function sign(payload) {
  return jwt.sign(payload, options.secretOrKey);
}

export default {
  passport,
  sign,
};
