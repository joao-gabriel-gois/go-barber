import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserSessionService from './AuthenticateUserSessionService';


let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserSessionService;

describe('CreateUserSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    
    authenticateUser = new AuthenticateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('Should be able to authenticate', async () => {
    
    const user = await fakeUsersRepository.create({
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
    await expect(authenticateUser.execute({
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate user with wrong password', async () => {
    await fakeUsersRepository.create({
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
