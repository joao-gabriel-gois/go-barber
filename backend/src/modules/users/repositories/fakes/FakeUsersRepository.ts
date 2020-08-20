import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/DTOs/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/DTOs/IFindAllProvidersDTO';

import User from "@modules/users/infra/typeorm/entities/User";

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({ exception_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    
    if (exception_user_id) {
      users = users.filter(user => user.id !== exception_user_id);
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.email === email);
    
    return userFound;
  }

  public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = new User();
 
    Object.assign(user, {
      id: uuid(),
      name,
      email,
      password
    })

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(userFound => userFound.id === user.id);

    this.users[findIndex] = user;
    
    return user;
  }
}

export default FakeUsersRepository;
