import sequelize from './database';
import { register, login } from './middlewares/user';

const matchToken = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

beforeAll(() => sequelize.sync());

describe('User registration', () => {
  it('Should be able to register', async () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    const response = await register({ body });

    expect(response).toMatch(matchToken);
  });

  it('Should not be able to register twice', () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    expect(register({ body })).rejects.toEqual(new Error('Already a user with email'));
  });

  it('Should reject incomplete requests', () => {
    const expectedError = new Error('Missing email / password in request');

    expect(register({ body: {} })).rejects.toEqual(expectedError);
    expect(register({ body: { email: 'test@test.com' } })).rejects.toEqual(expectedError);
    expect(register({ body: { password: 'supersecret' } })).rejects.toEqual(expectedError);
    expect(register({ body: { email: 'test@test.com', password: 123456789 } }))
      .rejects.toEqual(expectedError);
  });

  it('Should reject invalid email addresses', () => {
    expect(register({ body: { email: 'invalid', password: 'supersecret' } }))
      .rejects.toEqual(new Error('Invalid email'));
  });

  it('Should reject invalid passwords', () => {
    expect(register({ body: { email: 'test@test.com', password: 'super' } }))
      .rejects.toEqual(new Error('Password needs to be at least 6 characters long'));
  });
});

describe('User login', () => {
  (async () => {
    const body = {
      email: 'testing@email.com',
      password: 'secret_password',
    };

    await register({ body });
  })();

  it('Should log in user and return a JWT', async () => {
    const token = await login({
      body: {
        email: 'testing@email.com',
        password: 'secret_password',
      },
    });

    expect(token).toMatch(matchToken);
  });

  it('Should reject incomplete requests', () => {
    const expectedError = new Error('Missing email / password in request');

    expect(login({ body: {} })).rejects.toEqual(expectedError);
    expect(login({ body: { email: 'test@test.com' } })).rejects.toEqual(expectedError);
    expect(login({ body: { password: 'supersecret' } })).rejects.toEqual(expectedError);
  });

  it('Should fail when user does not exist', () => {
    expect(login({ body: { email: 'not@found.com', password: 'test' } }))
      .rejects.toEqual(new Error('Invalid email / password combination'));
  });

  it('Should fail when password is not correct', () => {
    expect(login({ body: { email: 'testing@email.com', password: 'wrong_password' } }))
      .rejects.toEqual(new Error('Invalid email / password combination'));
  });
});
