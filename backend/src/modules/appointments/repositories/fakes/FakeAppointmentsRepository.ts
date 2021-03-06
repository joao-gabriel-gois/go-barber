import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns'; 

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/DTOs/ICreateAppointmentDTO';
import IFindMonthlyCalendarOfPoviderDTO from '@modules/appointments/DTOs/IFindMonthlyCalendarOfProviderDTO';
import IFindDailyCalendarOfPoviderDTO from '@modules/appointments/DTOs/IFindDailyCalendarOfProviderDTO';

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];
  
  public async create({provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    
    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id
    });
    
    this.appointments.push(appointment);
    
    return appointment;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const appointmentFound = this.appointments.find(
      appointment => (
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id
      ),
    );
    
    return appointmentFound;
  }

  public async findDailyCalendarOfProvider({
    provider_id,
    day,
    month,
    year
  }: IFindDailyCalendarOfPoviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );

    return appointments;
  }

  public async findMonthlyCalendarOfProvider({
    provider_id,
    month,
    year
  }: IFindMonthlyCalendarOfPoviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );

    return appointments;
  }
}

export default AppointmentsRepository;
