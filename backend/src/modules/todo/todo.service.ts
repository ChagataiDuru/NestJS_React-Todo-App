import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ToDo, ToDoDocument } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoPayload } from './todo.payload';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<TodoPayload[]> {
    return this.todoModel.find().exec();
  }

  async findOneById(id: string): Promise<TodoPayload> {
    return this.todoModel.findById(id).exec();
  }

  async create(body: CreateTodoDto, reqUser: number): Promise<ToDo> {
    console.log('Request UserId:', reqUser);
    const user = await this.userService.findOneById(reqUser); 
    console.log('The User will saved for ToDo:', user);
    body.owner = user._id;
    console.log('The Owner of ToDo:', body.owner);
    const createdTodo = new this.todoModel(body);
    console.log('Todo to be created to save:', createdTodo);
    try {
      const todo = await createdTodo.save();
      console.log('Todo saved:', todo);
      return todo;
    } catch (error) {
      console.error('Error saving todo:', error);
      throw error;
    }
  }

  async update(id: string, todo: ToDo): Promise<TodoPayload> {
    return this.todoModel.findByIdAndUpdate(id, todo, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }
}
