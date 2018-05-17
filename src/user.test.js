import sequelize from './database';
import { register, login } from './user';

beforeAll(() => sequelize.sync());

describe('User registration', () => {
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

  it('Should reject incomplete requests', async () => {
    const expectedError = new Error('Missing email / password in request');

    expect(register({ body: {} })).rejects.toEqual(expectedError);
    expect(register({ body: { email: 'test@test.com' } })).rejects.toEqual(expectedError);
    expect(register({ body: { password: 'supersecret' } })).rejects.toEqual(expectedError);
    expect(register({ body: { email: 'test@test.com', password: 123456789 } })).rejects.toEqual(expectedError);
  });

  it('Should reject invalid email addresses', async () => {
    expect(register({ body: { email: 'invalid', password: 'supersecret' } }))
      .rejects.toEqual(new Error('Invalid email'));
  });

  it('Should reject invalid passwords', async () => {
    expect(register({ body: { email: 'test@test.com', password: 'super' } }))
      .rejects.toEqual(new Error('Password needs to be at least 6 characters long'));
  });
});
