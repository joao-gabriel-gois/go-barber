import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../DTOs/ICreateAppointmentDTO';
import IFindMonthlyCalendarOfProviderDTO from '../DTOs/IFindMonthlyCalendarOfProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findMonthlyCalendarOfProvider(
    data: IFindMonthlyCalendarOfProviderDTO
  ): Promise<Appointment[]>; 
}
