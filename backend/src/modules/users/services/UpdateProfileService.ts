import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  new_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
    ) {};

  public async execute({ user_id, name, email, new_password, password }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('User not found');
    }

    const anotherUserWithCurrentEmail = await this.usersRepository.findByEmail(email);

    if (anotherUserWithCurrentEmail && anotherUserWithCurrentEmail.id !== user.id) {
      throw new AppError('This email is already in use')
    }
    
    user.name = name;
    user.email = email;

    if (new_password && password) {
      const isRightOldPassword = await this.hashProvider.compareHash(password, user.password);

      if (!isRightOldPassword) {
        throw new AppError('Password informed is wrong, was not possible to change it', 401);
      }
      
      user.password = await this.hashProvider.generateHash(new_password);

    } else if (new_password) {
      throw new AppError('You need to inform the old password to set a new password');
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
