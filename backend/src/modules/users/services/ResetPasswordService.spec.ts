import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('PasswordReset', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  })

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123qwe321ewq',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '321654',
      token
    })

    const updatedUser = await fakeUsersRepository.findById(user.id);

   expect(generateHash).toHaveBeenCalledWith('321654');
   expect(updatedUser?.password).toBe('321654');
  });

  it('Should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token:'non-existing-token',
        password: '544344'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset the password without an user session', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existing-user-id');
    
    expect(
      resetPasswordService.execute({
        token,
        password: '544344'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123qwe321ewq',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    })

    expect(resetPasswordService.execute({
      password: '321654',
      token
    })).rejects.toBeInstanceOf(AppError);

  });

});;
