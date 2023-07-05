import { Module,MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './modules/mail/mail.module';
import { NotificationModule } from './modules/notification/notification.module';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot({ limit: 10, ttl: 60 }),
    MongooseModule.forRoot(process.env.DATABASE_URI, 
      {
        dbName: process.env.DATABASE_NAME,
      }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxx-yyyyyyyyy',
        },
      }
    }),
    UserModule,
    TodoModule,
    MailModule,
    NotificationModule,
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasfd'],
        }),
      )
      .forRoutes('*');
  }
}

