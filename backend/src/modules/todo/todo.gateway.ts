import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoService } from './todo.service';

@WebSocketGateway()
export class TodoGateway {
    @WebSocketServer() server: Server;

    constructor(private socketService: TodoService) {}
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, message: string) {
      console.log(`Received Todo from client ${client.id}: ${message}`);
      this.socketService.sendMessage(message);
    }
}