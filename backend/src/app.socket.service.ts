import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { NotificationService } from './modules/notification/notification.service';
import { TodoService } from './modules/todo/todo.service';
import { UserService } from './modules/user/user.service';

@Injectable()
export class AppSocketService {
  private socket: Socket;

  constructor(private todoService: TodoService, private userService: UserService, private notificationService: NotificationService ) {
    this.socket = io('http://localhost:3001');
    this.socket.on('connect', () => {
      console.log(`Connected to WebSocket server`);
    });
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('message', (data: string) => {
        observer.next(data);
      });
    });
  }

  onConnect(): Observable<void> {
    return new Observable<void>((observer) => {
      this.socket.on('connect', () => {
        observer.next();
      });
    });
  }

  onDisconnect(): Observable<void> {
    return new Observable<void>((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });
    });
  }
}
