import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TODO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'todo-microservice',
          port: 4001,
        },  
      },
    ]),
  ],
  controllers: [TodosController]
})
export class TodosModule {}
