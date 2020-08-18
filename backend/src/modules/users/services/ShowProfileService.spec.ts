import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    
    showProfile = new ShowProfileService(fakeUsersRepository);
  })

  it('Should be able to show the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123qwe321ewq',
    });

    const shownUser = await showProfile.execute({
      user_id: user.id,
    })

    expect(shownUser.name).toBe('John Doe');
    expect(shownUser.email).toBe('johndoe@example.com');
  });

  it('Should not be able to show a non existent user profile', async () => {
    await expect(showProfile.execute({
      user_id: 'non-existent-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
})
