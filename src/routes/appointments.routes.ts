import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentRouter = Router();
const appointmentsRepository = new AppointmentRepository();


appointmentRouter.get('/', (request, response) =>{
   const appointments = appointmentsRepository.findAll();

   return response.json(appointments);
})

appointmentRouter.post('/', (request, response) => {
   try {
      const { provider, date } = request.body;

      const parsedDate = parseISO(date);

      const createAppointmentService = new CreateAppointmentService(appointmentsRepository);

      const appointment = createAppointmentService.execute({
         provider,
         date: parsedDate
      });
      
      return response.json(appointment);

   } catch(err) {
      return response.status(400).json({
         error: err.message
      });
   }
});

export default appointmentRouter;