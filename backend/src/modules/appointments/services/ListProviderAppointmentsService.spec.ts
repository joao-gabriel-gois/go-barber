import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  })

  it('Should be able to list daily availability of provider', async () => {
    const firstAppointment = await fakeAppointmentsRepository.create({
      provider_id: 'fake-provider-id',
      user_id: 'fake-user-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const secondAppointment = await fakeAppointmentsRepository.create({
      provider_id: 'fake-provider-id',
      user_id: 'fake-user-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'fake-provider-id',
      day: 20,
      year: 2020,
      month: 5,
    });

    expect(appointments)
      .toEqual([firstAppointment, secondAppointment]);
  });
})
