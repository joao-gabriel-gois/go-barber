import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a new user when passing an existent email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    expect(createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    })).rejects.toBeInstanceOf(AppError);
  })
})