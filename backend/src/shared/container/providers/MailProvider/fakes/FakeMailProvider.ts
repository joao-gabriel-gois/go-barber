import IMailProvider from '../models/IMailProvider';
import ISendEmailDTO from '../DTOs/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendEmailDTO[] = [];
  
  public async sendMail(message: ISendEmailDTO): Promise<void> {
    this.messages.push(message);
  }
}
