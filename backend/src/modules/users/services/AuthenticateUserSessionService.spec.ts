import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserSessionService from './AuthenticateUserSessionService';

//should not use another service, but we will keep this way for now
import CreateUserService from './CreateUserService';

describe('CreateUserSession', () => {
  it('Should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserSessionService(fakeUsersRepository, fakeHashProvider);
    
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    const response = await authenticateUser.execute({
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate non existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserSessionService(fakeUsersRepository, fakeHashProvider);

    await expect(authenticateUser.execute({
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate user with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserSessionService(fakeUsersRepository, fakeHashProvider);
    
    await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    await expect(authenticateUser.execute({
      email: 'jonhdoe@example.com',
      password: 'lalala',
    })).rejects.toBeInstanceOf(AppError); 
  });
})
