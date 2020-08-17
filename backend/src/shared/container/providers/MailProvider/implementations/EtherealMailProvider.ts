
import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
 
import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendEmailDTO from '../DTOs/ISendMailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
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
  
  public async sendMail({ from, to, subject, templateData }: ISendEmailDTO): Promise<void> {
    const msg = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br'
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log(`Message: ${msg.messageId}`);
    console.log(`Message: ${nodemailer.getTestMessageUrl(msg)}`);
  }
}
