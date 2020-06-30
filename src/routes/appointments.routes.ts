import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentRouter = Router();

appointmentRouter.get('/', async (request, response) => {
   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
   const appointments = await appointmentsRepository.find();

   return response.json(appointments);
})

appointmentRouter.post('/', async (request, response) => {
   try {
      const { provider, date } = request.body;

      const parsedDate = parseISO(date);

      const createAppointmentService = new CreateAppointmentService();

      const appointment = await createAppointmentService.execute({
         provider,
         date: parsedDate
      });

      return response.json(appointment);

   } catch (err) {
      return response.status(400).json({
         error: err.message
      });
   }
});

export default appointmentRouter;