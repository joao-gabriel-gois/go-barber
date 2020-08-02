import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController()


appointmentRouter.use(ensureAuthentication);

/* appointmentRouter.get('/', async (request, response) => {
   const appointmentsRepository = new AppointmentsRepository();
   const appointments = await appointmentsRepository.find();

   return response.json(appointments);
}) */

appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;
