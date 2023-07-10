import * as readline from 'readline';
import { io, Socket } from 'socket.io-client';

export class AppClient {

  private args = process.argv.slice(2);
  private socket: Socket;

  private url = this.args[0] || 'http://localhost:3000';

  connect() {
    this.socket = io(this.url);
    this.socket.on('connect', () => {
      console.log(`Connected to WebSocket server: ${this.url}`);
    });
    this.socket.on('disconnect', () => {
      console.log(`Disconnected from WebSocket server: ${this.url}`);
    });
    this.socket.on('message', (message: string) => {
      console.log(`Received message: ${message}`);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: string) {
    this.socket.emit('message',this.socket, message);
  }

  authenticate(rl: readline.Interface) {
    rl.question('Enter your email: ', (email: string) => {
      rl.question('Enter your password: ', (password: string) => {
        const credentials = { email, password };
        this.sendMessage(JSON.stringify(credentials));
      });
    });
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on('line', (input: string) => {
      if (input === 'exit') {
        this.disconnect();
        process.exit();
      }
      this.sendMessage(input);
    });
  }


}

const client = new AppClient();
try {
  client.connect();
  client.start();
} catch (error) {
  console.error(error);
}
