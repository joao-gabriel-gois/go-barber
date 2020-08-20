import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController()


appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
