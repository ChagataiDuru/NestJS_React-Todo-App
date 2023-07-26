import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
const logger = new Logger('TodoService');

const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0',
    port: 4001,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  )  
  app.listen().then(() => {
    logger.log('Todo microservice is listening ... ');
  });
}
bootstrap();