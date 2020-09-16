import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../DTOs/ICreateAppointmentDTO';
import IFindMonthlyCalendarOfProviderDTO from '../DTOs/IFindMonthlyCalendarOfProviderDTO';
import IFindDailyCalendarOfProviderDTO from '../DTOs/IFindDailyCalendarOfProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;

  findDailyCalendarOfProvider(
    data: IFindDailyCalendarOfProviderDTO
  ): Promise<Appointment[]>;

  findMonthlyCalendarOfProvider(
    data: IFindMonthlyCalendarOfProviderDTO
  ): Promise<Appointment[]>; 
}
