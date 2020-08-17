import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);

  })

  it('Should be able to create a new appointment', async () => {

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'f3f87c5b-ed59-44ca-911f-05d2c1075c29',
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('f3f87c5b-ed59-44ca-911f-05d2c1075c29');
  })
})

describe('CreateAppointment', () => {
  it('Should not be able to create two appointments at the same date', async () => {

    const appointmentDate = new Date(2020, 6, 30, 20);

    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: 'f3f87c5b-ed59-44ca-911f-05d2c1075c29',
    })

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: 'f3f87c5b-ed59-44ca-911f-05d2c1075c29',
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})
