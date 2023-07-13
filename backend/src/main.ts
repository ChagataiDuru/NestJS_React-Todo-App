import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe,VersioningType  } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { setupSwagger } from './utils/setup-swager.util';
import { RedisIoAdapter } from './RedisIoAdapter';
//import { createAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({})
  );
  app.enableCors({ origin: '*' }) // enable cors for all origins
  app.useGlobalPipes(new ValidationPipe({}))
  app.enableVersioning({ type: VersioningType.URI })
  app.use(helmet()) // for security
  app.use(compression()) // for performance
  //const redisIoAdapter = new RedisIoAdapter(app);
  //await redisIoAdapter.connectToRedis();
  //app.useWebSocketAdapter(redisIoAdapter);
  app.listen(4000);
}
bootstrap();
