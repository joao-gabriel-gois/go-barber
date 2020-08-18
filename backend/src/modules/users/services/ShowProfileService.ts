import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {};

  public async execute({ user_id }: IRequestDTO): Promise<User> {
    const profile = await this.usersRepository.findById(user_id);

    if(!profile) {
      throw new AppError('User not found');
    }

    return profile;
  }
}

export default ShowProfileService;
