import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import router from './routers/index';

import { getEnvVar } from './utils/getEnvVar';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

dotenv.config();

export function setupServer() {
  const app = express();
  const PORT = getEnvVar('PORT', '3000');
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(
    cors({
      origin: getEnvVar('CLIENT_URL'),
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  );

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
