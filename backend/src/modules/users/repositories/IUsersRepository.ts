import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../DTOs/ICreateUserDTO';
import IFindAllProvidersDTO from '../DTOs/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  create(data: ICreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
