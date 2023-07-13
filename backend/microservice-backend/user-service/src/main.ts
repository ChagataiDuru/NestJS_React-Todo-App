import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

// Create new logger instance
const logger = new Logger('Main');

// Create micro service options
const microserviceOptions = {
  name: 'USER_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: 'redis://redis:6379',
  },
};
async function bootstrap() {
  const app = await NestFactory.createMicroservice(microserviceOptions);
  app.listen().then(() => {
    logger.log('User microservice is listening ... ');
  });
}
bootstrap();