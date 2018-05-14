import bcrypt from 'bcrypt';

import { sign } from './passport';
import { User } from './database';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: 'Missing email / password in request' });
    return;
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(401).json({ message: 'Invalid email / password combination' });
    return;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    res.status(401).json({ message: 'Invalid email / password combination' });
    return;
  }

  const payload = { id: user.id };
  const token = sign(payload);

  res.json({ message: 'ok', token });
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: 'Missing email / password in request' });
    return;
  }

  if (!User.validEmail(email)) {
    res.status(400).json({ message: 'Invalid email' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password needs to be at least 6 characters long' });
    return;
  }
};
