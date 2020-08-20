import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    
    listProviders = new ListProvidersService(fakeUsersRepository);
  })

  it('Should be able to list providers excluding current user, if its id was passed', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123qwe321ewq', 
    });

    const secondUser = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: 'ewqqwe321123', 
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123321qweewq', 
    });

    const otherUsersProfile = await listProviders.execute({
      user_id: loggedUser.id,
    })

    expect(otherUsersProfile).toEqual([
      firstUser,
      secondUser,
    ]); 
  });
})
