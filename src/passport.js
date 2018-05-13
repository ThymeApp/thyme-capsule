import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'thyme',
};

const strategy = new Strategy(options, (payload, next) => {
  // next(err, user);
});

passport.use(strategy);

export default passport;
