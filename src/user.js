// @flow

import bcrypt from 'bcrypt';

import type { ThymeRequest } from './types';

import { sign } from './passport';
import { User } from './database';

function tokenForUser(user: { id: string }): string {
  const payload = { id: user.id };
  return sign(payload);
}

function createPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10) || 10);
}

export const login = async ({ body }: ThymeRequest): Promise<string> => {
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

  return tokenForUser(user);
};

export const refreshToken = async ({ user }: ThymeRequest): Promise<string> => {
  if (!user) {
    throw new Error('Missing user auth object');
  }

  return tokenForUser(user);
};

export const register = async ({ body }: ThymeRequest): Promise<string> => {
  const { email, password } = body;

  if (!email || !password || typeof password !== 'string') {
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

  const createdUser = await User.create({
    email,
    password: await createPasswordHash(password),
  });

  return tokenForUser(createdUser);
};

export const changePassword = async ({ user, body }: ThymeRequest): Promise<boolean> => {
  if (!user) {
    throw new Error('Missing user auth object');
  }

  const { password, currentPassword } = body;

  const matched = await bcrypt.compare(currentPassword, user.password);

  if (!matched) {
    throw new Error('Current password is incorrect');
  }

  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('New password needs to be at least 6 characters long');
  }

  await user.update({ password: await createPasswordHash(password) });

  return true;
};
