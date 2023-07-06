import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ToDo, ToDoDocument } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoPayload } from './todo.payload';
import { UserService } from '../user/user.service';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { NotificationService } from '../notification/notification.service';
import { UpdateBoolTodoDto } from './dtos/update-bool.dto';
import { UserDocument } from '../user/user.schema';
import { Server } from 'socket.io';


@Injectable()
export class TodoService {
  private messages: string[] = [];

  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>,
    private userService: UserService,
    private notificationService: NotificationService, 
    private server: Server,
  ) {}

  async findAll(): Promise<ToDoDocument[]> {
    return this.todoModel.find().populate("owner").exec();
  }

  async findOneByOwner(owner: UserDocument): Promise<ToDoDocument[]> {
    return this.todoModel.find({ owner: owner }).exec();
  }

  async findOneById(id: string): Promise<ToDoDocument> {
    return this.todoModel.findById(id).exec();
  }

  async findTodosById(Id: number): Promise<TodoPayload[]> {
    const user = await this.userService.findOneById(Id);
    const todos = await this.todoModel.find({ owner: user }).exec();
    const dueTodos = todos.filter((todo) => todo.due < new Date());
    const approvedTodos = todos.filter((todo) => todo.approved);
    console.log(approvedTodos);
    this.notificationService.createNotificationsForDueTodos(dueTodos,user);
    this.notificationService.createNotificationsForApprovedTodos(approvedTodos,user);
    return todos
  }

  async listApproveTodos(bool: boolean): Promise<ToDo[]> {
    return await this.todoModel.find({ approved: bool }).exec();
  }

  async updateField(req: any, Id: number,dto: UpdateBoolTodoDto): Promise<TodoPayload> {
    const todo = await this.todoModel.findOne({todoId : Id}).exec().catch((error) =>
      {
        console.log(error)
        throw new HttpException('ToDo not found',HttpStatus.NOT_FOUND);
      });

    const user = await this.userService.findUser(String(todo.owner));
    if (user.fullName === req.currentUser.fullName) {
      if (user.isAdmin) {
        todo.completed = dto.completed || false
        todo.approved  = dto.approved  || false
      }else{
        todo.completed = dto.completed || false
      }
      todo.save();
      return todo;
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async create(body: CreateTodoDto, reqUser: number): Promise<ToDo> {
    const user = await this.userService.findOneById(reqUser); 
    console.log('The User will saved for ToDo:', user);

    body.owner = user._id;
    body.approved = false;
    body.completed = false;
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

  sendMessage(message: string) {
    this.messages.push(message);
    this.server.emit('message', message);
  }

  getMessages(): string[] {
    return this.messages;
  }
}
