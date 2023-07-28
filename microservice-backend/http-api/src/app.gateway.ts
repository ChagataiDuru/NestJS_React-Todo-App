import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthenticatedGuard } from './guards/ws.guard';
import { AppService } from './app.service';
import { ClientProxy,ClientProxyFactory,Transport } from '@nestjs/microservices';
import { TodoDto } from './todos/todo.dto';
import { UserDto } from './users/dtos/user.dto';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');
  private userClient: ClientProxy;
  private todoClient: ClientProxy;
  constructor(private readonly appService: AppService) {
    this.todoClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'todo-microservice',
        port: 4001,
      },
    });
    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'user-microservice',
        port: 4002,
      },
    });
  }

  afterInit(server: Server) {
    this.appService
      .getEventsToEmit()
      .asObservable()
      .subscribe({
        next: (event) => {
          server.emit(event.name, event.data);
        },
      });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }


  //@UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: string): void {
    this.logger.log(`Client ${socket.id} sent: ${data}`);
    this.server.sockets.emit('message', data);
  }

  @SubscribeMessage('whoami')
  private async handleWhoAmI(@ConnectedSocket() socket: Socket): Promise<void> {
    this.logger.log(`Client ${socket.id} sent: whoami`);
    console.log(socket.handshake.headers);
    const id = Number(socket.handshake.headers.userid);
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.userClient.send({ cmd: 'getUser' }, {userid: id}).subscribe({
        next: (user: UserDto) => {
          resolve(user);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    socket.emit('whoami', user);
  }

  //@UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('get-todos')
  private async handleGetTodos(@ConnectedSocket() socket: Socket): Promise<void> {
    this.logger.log(`Client ${socket.id} sent: get-todos`);
    const id = Number(socket.handshake.headers.userid); 
    this.logger.log(socket.handshake.headers.userid); 
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.userClient.send({ cmd: 'getUser' }, {userid: id}).subscribe({
        next: (user: UserDto) => {
          resolve(user);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    const todos = await new Promise<TodoDto[]>((resolve, reject) => {
      this.todoClient.send({ cmd: 'findMyTodos' }, {owner: user}).subscribe({
        next: (todos: TodoDto[]) => {
          resolve(todos);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    this.server.sockets.emit('get-todos', todos);
  }

  //@UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('create-todo')
  private async handleCreateTodo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() todo: any,
  ): Promise<void> {
    this.logger.log(`Client ${socket.id} sent: create-todo`);
    const id = Number(socket.handshake.headers.userid); 
    this.logger.log(socket.handshake.headers.userid); 
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.userClient.send({ cmd: 'getUser' }, {userid: id}).subscribe({
        next: (user: UserDto) => {
          resolve(user);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    console.log(user);
    const serverTodo = 
    {
        title: todo.title,
        description: todo.text,
        due: todo.dueDate
    };
    console.log(serverTodo);
    const createdTodo = await new Promise<TodoDto>((resolve, reject) => {
      this.todoClient.send({ cmd: 'createTodo' }, {todo: serverTodo, user: user}).subscribe({
        next: (todo: TodoDto) => {
          resolve(todo);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    this.server.sockets.emit('create-todo', createdTodo);
  }

  //@UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('update-todo')
  private async handleUpdateTodo(
    @ConnectedSocket() socket: Socket,
    @MessageBody() todo: any,
  ): Promise<void> {
    this.logger.log(`Client ${socket.id} sent: update-todo`);
    const id = Number(socket.handshake.headers.userid); 
    this.logger.log(socket.handshake.headers.userid); 
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.userClient.send({ cmd: 'getUser' }, {userid: id}).subscribe({
        next: (user: UserDto) => {
          resolve(user);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    const serverTodo = 
    {
        title: todo.title,
        description: todo.text,
        due: todo.dueDate
    };
    const updatedTodo = await new Promise<TodoDto>((resolve, reject) => {
      this.todoClient.send({ cmd: 'updateTodo' }, {todo: serverTodo, user: user}).subscribe({
        next: (todo: TodoDto) => {
          resolve(todo);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
    this.server.sockets.emit('update-todo', updatedTodo);
  }
}