import { Module,MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ limit: 10, ttl: 60 }),
    MongooseModule.forRoot(process.env.DATABASE_URI, 
      {
        dbName: process.env.DATABASE_NAME,
      }),
    UserModule,
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

