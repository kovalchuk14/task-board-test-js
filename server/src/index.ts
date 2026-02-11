import { setupServer } from './server';
import { initMongoConnection } from './db/initMongoConnection';

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();
