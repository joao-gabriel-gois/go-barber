import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthentication from '../middlewares/ensureAuthentication';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthentication);

profileRouter.get('/', profileController.show);
profileRouter.put('/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      new_password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('new_password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
