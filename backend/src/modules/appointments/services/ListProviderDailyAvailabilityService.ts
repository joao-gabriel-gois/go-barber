import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDailyAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {};

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequestDTO): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findDailyCalendarOfProvider({
      provider_id,
      day,
      month,
      year,
    });

    const businessDayStartingHour = 8;

    const businessDayHoursArray = Array.from(
      { length: 10 },
      (_, index) => index + businessDayStartingHour
    );

    const currentDateHour = new Date(Date.now());

    const availability = businessDayHoursArray.map(hour => {
      const hasAppointAtThisHour = appointments.find(appointment =>
        // if current iteration hour was found, it means it is scheduled already,
        // so, by denying, you get the availability, bellow in the return statement
        getHours(appointment.date) === hour,
      );

      const iterationDateHour = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointAtThisHour && isAfter(iterationDateHour, currentDateHour),
      }
    });


    return availability;
  }
}

export default ListProviderDailyAvailabilityService;
