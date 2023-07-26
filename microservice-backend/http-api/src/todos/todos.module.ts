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
          host: process.env.TODO_SERVICE_HOST || 'localhost',
          port: 4001,
        },  
      },
    ]),
  ],
  controllers: [TodosController]
})
export class TodosModule {}
