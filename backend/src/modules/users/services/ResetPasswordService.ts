import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';

/* import User from '../infra/typeorm/entities/User'; */
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
  password_confirmation: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {};
  
  public async execute({ token, password, password_confirmation }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);
    
    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    if (password_confirmation !== password) {
      throw new AppError('Tried to set password without confirm it')
    }
    
    const user = await this.usersRepository.findById(userToken.user_id);
    
    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreationTime = userToken.created_at;
    const expiringDate = addHours(tokenCreationTime, 2);

    if (isAfter(Date.now(), expiringDate)) {
      throw new AppError('Token has expired');
    }
    
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
