import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthlyAvailabilityController from '../controllers/ProviderMonthlyAvailabilityController';
import ProviderDailyAvailabilityController from '../controllers/ProviderDailyAvailabilityController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthlyAvailabilityController = new ProviderMonthlyAvailabilityController();
const providerDailyAvailabilityController = new ProviderDailyAvailabilityController();

providersRouter.use(ensureAuthentication);

providersRouter.get('/', providersController.index);

providersRouter.get('/:provider_id/monthly-availability', 
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthlyAvailabilityController.index,
);
providersRouter.get('/:provider_id/daily-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDailyAvailabilityController.index
);


export default providersRouter;
