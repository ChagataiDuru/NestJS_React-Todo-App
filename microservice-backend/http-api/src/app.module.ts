import { Module } from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [UsersModule, TodosModule,
      ClientsModule.register([
        {
          name: 'USER_SERVICE',
          transport: Transport.REDIS,
          options: {
            url: 'redis://localhost:6379',
          },
        },
      ]),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
