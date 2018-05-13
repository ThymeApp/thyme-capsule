import bcrypt from 'bcrypt';

import { sign } from './passport';
import { User } from './database';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: 'Missing username / password in request' });
    return;
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    res.status(401).json({ message: 'Invalid username / password combination' });
    return;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    res.status(401).json({ message: 'Invalid username / password combination' });
    return;
  }

  const payload = { id: user.id };
  const token = sign(payload);

  res.json({ message: 'ok', token });
};
