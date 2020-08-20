import { Router } from 'express';

import ProvidersController from '../controllers/ProvidersController';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';

const providersRouter = Router();
const providersController = new ProvidersController()


providersRouter.use(ensureAuthentication);

providersRouter.get('/', providersController.index);

export default providersRouter;
