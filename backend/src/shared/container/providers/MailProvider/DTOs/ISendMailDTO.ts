import IParseEmailDTO from '@shared/container/providers/MailTemplateProvider/DTOs/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}
export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseEmailDTO;
}