import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe,VersioningType  } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({})
  );
  app.enableCors({ origin: '*' }) // enable cors for all origins
  app.useGlobalPipes(new ValidationPipe({}))
  app.enableVersioning({ type: VersioningType.URI })
  app.use(helmet()) // for security
  app.use(compression()) // for performance
  await app.listen(3000);
}
bootstrap();
