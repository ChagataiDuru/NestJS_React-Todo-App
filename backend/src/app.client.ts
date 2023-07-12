import * as readline from 'readline';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export class AppClient {

  private args = process.argv.slice(2);
  private socket: Socket;

  private url = this.args[0] || 'http://localhost:3000';
  socketOptions: any

  connect() {
    this.socketOptions = {
      withCredentials: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            userId: 0,
          }
        }
      }
    };

    this.socket = io(this.url, this.socketOptions);
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
    console.log(`Sending message: ${message}`);
    this.socket.emit('message', message);
  }

  async authenticate(rl: readline.Interface) {
    const email = await this.prompt(rl, 'Enter your email: ');
    const password = await this.prompt(rl, 'Enter your password: ');

    try {
      const response = await axios.post(`${this.url}/auth/signin`, { email, password }, { withCredentials: true });
      this.socketOptions.transportOptions.polling.extraHeaders.userId = response.data.userId;
      console.log(`Authenticated with Id: ${response.data.userId}`);
    } catch (error) {
      console.error(`Authentication failed: ${error.message}`);
      this.authenticate(rl);
    }
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.authenticate(rl);
    console.log('Type a message and press enter to send');
    console.log('Type "exit" to quit');
    rl.on('line', (input: string) => {
      if (input === 'exit') {
        this.disconnect();
        process.exit();
      }
      this.sendMessage(input);
    });
  }

  private async prompt(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer: string) => {
        resolve(answer);
      });
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