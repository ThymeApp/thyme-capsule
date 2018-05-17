import sequelize from './database';
import { register, login } from './user';

beforeAll(() => sequelize.sync());

describe('users', () => {
  it('Should be able to register', async () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    const response = await register({ body });

    expect(response).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  });

  it('Should not be able to register twice', async () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    expect(register({ body })).rejects.toEqual(new Error('Already a user with email'));
  });
});
