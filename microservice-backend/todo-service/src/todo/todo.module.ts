import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { AutoIncrementID, AutoIncrementIDOptions } from '@typegoose/auto-increment'
import mongoose from 'mongoose';

import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ToDo, ToDoSchema } from './todo.schema';



@Module({
  imports: [
    
    MongooseModule.forFeatureAsync([
        {
          name: ToDo.name,
          inject: [getConnectionToken()],
          useFactory: (connection: mongoose.Connection): ModelDefinition['schema'] => {
            const schema = ToDoSchema
            schema.plugin(AutoIncrementID, { field: 'todoId' } as AutoIncrementIDOptions)
            return schema
          }
        }
      ]),
],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
