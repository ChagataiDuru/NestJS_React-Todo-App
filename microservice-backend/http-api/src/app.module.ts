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
          name: 'SERVICES',
          transport: Transport.REDIS,
          options: {
            url: process.env.REDIS_URL || 'redis://localhost:6379',
          },
        },
      ]),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
