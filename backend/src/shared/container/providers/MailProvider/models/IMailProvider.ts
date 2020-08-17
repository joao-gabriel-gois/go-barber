import ISendEmailDTO from '../DTOs/ISendMailDTO';
export default interface IMailProvider {
  sendMail(data: ISendEmailDTO): Promise<void>;
}
