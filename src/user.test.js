import { register, login } from './user';

describe('users', () => {
  it('Should be able to register', async () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    const response = await register({ body });

    expect(response).toMatch(/^[A-Za-z0-9]+\.[A-Za-z0-9]+\.[A-Za-z0-9]+$/);
  });

  it('Should not be able to register twice', async () => {
    const body = {
      email: 'test@email.com',
      password: 'secret_password',
    };

    const response = await register({ body });

    expect(response).toMatch(/^[A-Za-z0-9]+\.[A-Za-z0-9]+\.[A-Za-z0-9]+$/);
  });
});
