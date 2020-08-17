import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

/* import User from '../infra/typeorm/entities/User'; */
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
    
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,
  ) {};
  
  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
  
    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[GoBarber] - Recuperação de Senha',
      templateData: {
        template: 'Olá, {{name}}',
        variables: {
          name: user.name,
        },
      }
    });
  }
}

export default SendForgotPasswordEmailService;
