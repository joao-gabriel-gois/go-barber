import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear } from 'date-fns'; 

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/DTOs/ICreateAppointmentDTO';
import IFindMonthlyCalendarOfPoviderDTO from '@modules/appointments/DTOs/IFindMonthlyCalendarOfProviderDTO';

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];
  
  public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    
    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id
    });
    
    this.appointments.push(appointment);
    
    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFound = this.appointments.find(appointment => isEqual(appointment.date, date));
    
    return appointmentFound;
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
