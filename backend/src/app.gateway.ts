import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppSocketService } from './app.socket.service';
import { Session, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './modules/user/auth.service';

type session = {
  userId: string;
  isAdmin: string;
};

@WebSocketGateway()
export class AppGateway {
    @WebSocketServer() server: Server;

    constructor(private socketService: AppSocketService) {}
  
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
    async handleMessage(@Session() session: any,client: Socket, payload: string): Promise<void> {
      console.log(`Received message: ${payload} from client: ${client}`);
      console.log(`Session: ${session}`);
      console.log('client: ', client.request.headers);
      console.log('client.request.headers.cookie: ', client.request.headers.cookie);
      const cookie = client.request.headers.cookie;
      if (!client || !client.request || !client.request.headers || !client.request.headers.cookie) {
        throw new UnauthorizedException('Session cookie not found');
      }
      const Sess = cookie.split(';').reduce((prev, current) => {
        const [name, value] = current.trim().split('=');
        return { ...prev, [name]: value };
      }, {});
      const userId = session.userId;
      const isAdmin = session.isAdmin === 'true';
      if (!userId) {
        throw new UnauthorizedException('User ID not found in session cookie');
      }
      this.server.emit('message', payload);
    }
}