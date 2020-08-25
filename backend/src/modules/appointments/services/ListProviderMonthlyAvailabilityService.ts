import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListProviderMonthlyAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {};

  public async execute({ provider_id, month, year }: IRequestDTO): Promise<IResponse> {
    const monthlyAppointmentsCalendar = await this.appointmentsRepository.findMonthlyCalendarOfProvider({
      provider_id,
      month,
      year
    });
    
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const daysInMonthArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    const availability = daysInMonthArray.map(day => {
      const appointmentsInDay = monthlyAppointmentsCalendar.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });
    
    return availability;
  }
}

export default ListProviderMonthlyAvailabilityService;
