import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthlyAvailabilityService from './ListProviderMonthlyAvailabilityService';

let listProviderMonthlyAvailability: ListProviderMonthlyAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthlyAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthlyAvailability = new ListProviderMonthlyAvailabilityService(
      fakeAppointmentsRepository
    );
  })

  it('Should be able to list monthly availability of provider', async () => {
    // tests will fail for now, because service is also checking maximum
    // in the same day and for now tested month only has one and expects no availability
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
    })
    
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 3, 20, 8, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const providerAvailability = await listProviderMonthlyAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(providerAvailability)
      .toEqual(expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
      ]),
    );
  });
})
