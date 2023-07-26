import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { ToDo, ToDoDocument } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoPayload } from './todo.payload';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { UpdateBoolTodoDto } from './dtos/update-bool.dto';

@Injectable()
export class TodoService {
  private messages: string[] = [];

  private io: Server;
  
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>
  ) {}
  
  @MessagePattern({ cmd: 'getTodos' })
  async findAll(): Promise<ToDoDocument[]> {
    return this.todoModel.find().populate("owner").exec();
  }

  @MessagePattern({ cmd: 'getTodosByOwner' })
  async findOneByOwner(owner: any): Promise<ToDoDocument[]> {
    return this.todoModel.find({ owner: owner }).exec();
  }

  @MessagePattern({ cmd: 'getTodosByObjectId' })
  async findOneById(id: string): Promise<ToDoDocument> {
    return this.todoModel.findById(id).exec();
  }

/*   @MessagePattern({ cmd: 'getTodosById' })
  async findTodosById(): Promise<TodoPayload[]> {
    const user = await this.io.get(`user`);
    console.log(user);
    const todos = await this.todoModel.find({ owner: user }).exec();
    const dueTodos = todos.filter((todo) => todo.due < new Date());
    const approvedTodos = todos.filter((todo) => todo.approved);
    console.log(approvedTodos);
    return todos
  } */

  @MessagePattern({ cmd: 'listApproveTodos' })
  async listApproveTodos(bool: boolean): Promise<ToDo[]> {
    return await this.todoModel.find({ approved: bool }).exec();
  }

  @MessagePattern({ cmd: 'updateTodoField' })
  async updateField(req: any, Id: number,dto: UpdateBoolTodoDto): Promise<TodoPayload> {
    const todo = await this.todoModel.findOne({todoId : Id}).exec().catch((error) =>
      {
        console.log(error)
        throw new HttpException('ToDo not found',HttpStatus.NOT_FOUND);
      });
      return todo;
/*     const user = await this.userService.findUser(String(todo.owner));
    if (user.fullName === req.currentUser.fullName) {
      if (user.isAdmin) {
        todo.completed = dto.completed || false
        todo.approved  = dto.approved  || false
      }else{
        todo.completed = dto.completed || false
      }
      todo.save();
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } */
  }

/*   @MessagePattern({ cmd: 'updateTodoField' })
  async create(body: CreateTodoDto, reqUser: number): Promise<ToDo> {
    const user = await this.redis.get(`user`);
    console.log('The User will saved for ToDo:', user);

    //body.owner = user._id;
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
  } */

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
    this.io.emit('message', message);
  }

  sendToClient(clientId: string, message: string) {
    this.io.to(clientId).emit('message', message);
  }

  getMessages(): string[] {
    return this.messages;
  }

  listClients(): string[] {
    const clients: string[] = [];
    this.io.sockets.sockets.forEach((socket: Socket) => {
      console.log(socket.id);
      console.log(socket.data);
      const user = socket.data.user;
      console.log(user);
      const client = `${socket.id} (${user ? user.email : 'anonymous'})`;
      clients.push(client);
    });
    return clients;
  }

}
