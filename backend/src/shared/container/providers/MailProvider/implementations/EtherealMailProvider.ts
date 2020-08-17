import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  
  constructor() {
    nodemailer.createTestAccount().then(account => {
      const { smtp, user, pass } = account;
      const { host, port, secure } = smtp;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
      });

      this.client = transporter
    });
  }
  
  public async sendMail(to: string, body: string): Promise<void> {
    const msg = await this.client.sendMail({
      from: 'equipe@gobarber.com.br',
      to,
      subject: 'Recuperação de Senha',
      text: body,
    });

    console.log(`Message: ${msg.messageId}`);
    console.log(`Message: ${nodemailer.getTestMessageUrl(msg)}`);
  }
}
