import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController()
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.post('/', appointmentsController.create);

appointmentsRouter.get('/current-provider', providerAppointmentsController.index);

export default appointmentsRouter;
