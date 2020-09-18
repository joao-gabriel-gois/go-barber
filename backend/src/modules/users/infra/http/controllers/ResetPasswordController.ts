import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password_confirmation, password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);
  
    await resetPassword.execute({
      password,
      password_confirmation,
      token
    });
  
    return response.status(204).json();
  }
}
