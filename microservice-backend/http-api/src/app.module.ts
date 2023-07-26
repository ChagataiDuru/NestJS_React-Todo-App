import { MiddlewareConsumer, Module } from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

const cookieSession = require('cookie-session');


@Module({
  imports: [UsersModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
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
