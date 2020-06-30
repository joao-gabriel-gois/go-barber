import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter); // remember middlewares fundamentals here
routes.use('/users', usersRouter); // remember middlewares fundamentals here

export default routes;
