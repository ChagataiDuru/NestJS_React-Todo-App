import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ToDo, ToDoDocument } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoPayload } from './todo.payload';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateTodoDto } from './dtos/update-todo.dto';

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

  async findTodosById(userId: number): Promise<TodoPayload[]> {
    const user = await this.userService.findOneById(userId);
    const todos = await this.todoModel.find({ owner: user._id }).populate('owner').exec();
    return todos;
  }

  async findApprovedTodos(): Promise<TodoPayload[]> {
    return this.todoModel.find({ approved: true }).exec();
  }

  async create(body: CreateTodoDto, reqUser: number): Promise<ToDo> {
    const user = await this.userService.findOneById(reqUser); 
    console.log('The User will saved for ToDo:', user);

    body.owner = user._id;
    body.approved = false;
    console.log('ToDo to be created to save:', body);
    const createdTodo = new this.todoModel(body);

    try {
      const todo = await createdTodo.save();
      console.log('Todo saved:', todo);
      return todo;
    } catch (error) {
      console.error('Error saving todo:', error);
      throw error;
    }
  }

  async update(id: string, todo: UpdateTodoDto): Promise<TodoPayload> {
    return this.todoModel.findByIdAndUpdate(id, todo, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.todoModel.findByIdAndDelete(id).exec();
  }

  @OnEvent('user.deleted', { async: true })
  async handleUserDeletedEvent(id: number): Promise<void> {
    console.log(`I am ToDo Service and User with id:${id} deleted`);
    await this.todoModel.deleteMany({ owner: id }).exec();
  }
}
