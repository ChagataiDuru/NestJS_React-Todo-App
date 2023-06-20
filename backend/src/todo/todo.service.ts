import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITodo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<ITodo>) {}

  async findAll(): Promise<ITodo[]> {
    return this.todoModel.find().exec();
  }

  async findOneById(id: string): Promise<ITodo> {
    return this.todoModel.findById(id).exec();
  }

  async create(todo: ITodo): Promise<ITodo> {
    const createdTodo = new this.todoModel(todo);
    return createdTodo.save();
  }

  async update(id: string, todo: ITodo): Promise<ITodo> {
    return this.todoModel.findByIdAndUpdate(id, todo, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }
}