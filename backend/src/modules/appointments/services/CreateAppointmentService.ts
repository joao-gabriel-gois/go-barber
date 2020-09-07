import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// Bellow we have the only entity denpending on infra layer, would be good
// To refactor later but for now we choosed to keep this as the only
// coupled part of our software. If it get bigger in future, would be good to 
// abstract also the entity
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
   provider_id: string,
   user_id: string;
   date: Date
}

@injectable()
class CreateAppointmentService {
   constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    ) {};

   public async execute({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {
      const appointmentDate = startOfHour(date);
      
      if (isBefore(appointmentDate, Date.now())) {
        throw new AppError('Not allowed to create an appointment on a past date');
      }

      if (user_id === provider_id) {
        throw new AppError('Not allowed to create an Appointment for yourself');
      }

      if (getHours(date) < 8 || getHours(date) > 17) {
        throw new AppError('Not allowed to create an Appointment before 8am or after 17pm');
      }

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is already booked');
      }

      const appointment = await this.appointmentsRepository.create({
         provider_id,
         user_id,
         date: appointmentDate,
      });

      const formattedDate = format(appointment.date, "dd/MM/yyyy 'às' HH:mm 'horas'");
      
      await this.notificationsRepository.create({
        recepient_id: provider_id,
        content: `Novo agendamento criado para o dia ${formattedDate}`
      })

      await this.cacheProvider.invalidate(
        `provider-appointments:${provider_id}:${format(
          appointmentDate,
          'yyyy-M-d'
        )}`,
      );

      return appointment;
   }
}

export default CreateAppointmentService;
