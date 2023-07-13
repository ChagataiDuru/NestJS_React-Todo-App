import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

// Create new logger instance
const logger = new Logger('Main');

// Create micro service options
const microserviceOptions = {
  name: 'TODO_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: 'redis://redis:6379',
  },
};
async function bootstrap() {
  const app = await NestFactory.createMicroservice(microserviceOptions);
  app.listen().then(() => {
    logger.log('Todo microservice is listening ... ');
  });
}
bootstrap();