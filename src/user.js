import bcrypt from 'bcrypt';

import { sign } from './passport';
import { User } from './database';

export const login = async ({ body }) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error('Missing email / password in request');
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Invalid email / password combination');
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error('Invalid email / password combination');
  }

  const payload = { id: user.id };
  const token = sign(payload);

  return { message: 'ok', token };
};

export const refreshToken = async ({ user }) => {
  const payload = { id: user.id };
  const token = sign(payload);

  return { message: 'ok', token };
};

export const register = async ({ body }) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error('Missing email / password in request');
  }

  if (!User.validEmail(email)) {
    throw new Error('Invalid email');
  }

  if (password.length < 6) {
    throw new Error('Password needs to be at least 6 characters long');
  }

  const user = await User.findOne({ where: { email } });

  if (user) {
    throw new Error('Already a user with email');
  }

  const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS || 10);

  const createdUser = await User.create({ email, password: hash });

  return createdUser.toObject();
};
