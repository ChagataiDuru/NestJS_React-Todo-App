import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>) {}

  async findAll(): Promise<ToDo[]> {
    return this.todoModel.find().exec();
  }

  async findOneById(id: string): Promise<ToDo> {
    return this.todoModel.findById(id).exec();
  }

  async create(todo: ToDo): Promise<ToDo> {
    const createdTodo = new this.todoModel(todo);
    return createdTodo.save();
  }

  async update(id: string, todo: ToDo): Promise<ToDo> {
    return this.todoModel.findByIdAndUpdate(id, todo, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }
}