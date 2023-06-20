import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDo } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoPayload } from './todo.payload';

@Injectable()
export class TodoService {
  constructor(@InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>) {}

  async findAll(): Promise<TodoPayload[]> {
    return this.todoModel.find().exec();
  }

  async findOneById(id: string): Promise<TodoPayload> {
    return this.todoModel.findById(id).exec();
  }

  async create(todo: CreateTodoDto): Promise<ToDo> {
    const createdTodo = new this.todoModel(todo);
    return createdTodo.save();
  }

  async update(id: string, todo: ToDo): Promise<TodoPayload> {
    return this.todoModel.findByIdAndUpdate(id, todo, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }
}