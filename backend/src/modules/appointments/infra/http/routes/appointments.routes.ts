import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController()
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    }
  }, { abortEarly: false}),
  appointmentsController.create,
);
appointmentsRouter.get('/current-provider', providerAppointmentsController.index);

export default appointmentsRouter;
