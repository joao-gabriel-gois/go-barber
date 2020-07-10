import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import ensureAuthentication from '../middlewares/ensureAuthentication';

const appointmentRouter = Router();

appointmentRouter.use(ensureAuthentication);

appointmentRouter.get('/', async (request, response) => {
   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
   const appointments = await appointmentsRepository.find();

   return response.json(appointments);
})

appointmentRouter.post('/', async (request, response) => {
   const { provider_id, date } = request.body;

   const parsedDate = parseISO(date);

   const createAppointmentService = new CreateAppointmentService();

   const appointment = await createAppointmentService.execute({
      provider_id,
      date: parsedDate
   });

   return response.json(appointment);
});

export default appointmentRouter;