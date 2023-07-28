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
import { TodoService } from './modules/todo/todo.service';
import { UserService } from './modules/user/user.service';
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly appService: AppService,private todoService: TodoService,private userServie: UserService) {}

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


  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: string): void {
    this.logger.log(`Client ${socket.id} sent: ${data}`);
    this.server.sockets.emit('message', data);
  }

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('get-todos')
  private async handleGetTodos(@ConnectedSocket() socket: Socket): Promise<void> {
    this.logger.log(`Client ${socket.id} sent: get-todos`);
    this.logger.log(socket.handshake.headers.userid);
    const user = await this.userServie.findOneById(Number(socket.handshake.headers.userid));
    const todos = await this.todoService.findOneByOwner(user);
    this.server.sockets.emit('get-todos', todos);
  }


}
