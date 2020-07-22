import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';
import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// criar exception handler e ver se importando e usando aqui funciona (provavelmente sim)
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
   if (error instanceof AppError) {
      const { statusCode, message } = error;

      return response.status(statusCode).json({
         status: 'error',
         message
      });
   }

   console.error(error);

   return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
   });
})

app.listen(3333, () => {
   console.log('Backend is on! 🚀');
})
