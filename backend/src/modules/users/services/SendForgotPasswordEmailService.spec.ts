import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    
    
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  })

  it('Should be able to recover password by inserting an email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    })

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover non-existent user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgt password token for current user', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
    
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123qwe321ewq',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    })

    expect(generateToken).toHaveBeenCalledWith(user.id);
  })
})
