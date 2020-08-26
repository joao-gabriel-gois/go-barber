import { Router } from 'express';

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

providersRouter.get('/:provider_id/monthly-availability', providerMonthlyAvailabilityController.index);
providersRouter.get('/:provider_id/daily-availability', providerDailyAvailabilityController.index);

export default providersRouter;
