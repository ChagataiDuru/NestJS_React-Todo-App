import * as readline from 'readline';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export class AppClient {

  private args = process.argv.slice(2);
  private socket: Socket;

  private url = this.args[0] || 'http://localhost:4000';
  socketOptions: any

  constructor(private rl: readline.Interface) {}

  async start() {
    try {
      
      let option = '';
      while (option !== '3') {
        console.log('Select an option:');
        console.log('1 - Get all todos');
        console.log('2 - Create todo');
        console.log('3 - Sign out');
        option = await this.prompt(rl, '');
  
        switch (option) {
          case '1':
            this.getTodos();
            break;
          case '2':
            const todo = await this.prompt(rl, 'Enter todo text: ');
            this.createTodo(todo);
            break;
          case '3':
            this.signOut();
            break;
          default:
            console.log('Invalid option');
            break;
        }
      }
    } catch (error) {
      console.error(`Authentication failed: ${error.message}`);
      this.disconnect();
      process.exit();
    }
  }

  public async connect(): Promise<void> {
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

    try {
      console.log('Enter your email:');
      const email = await this.prompt(rl, '');
      console.log('Enter your password:');
      const password = await this.prompt(rl, '');

      const response = await axios.post(`${this.url}/auth/signin`, { email, password }, { withCredentials: true });
      this.socketOptions.transportOptions.polling.extraHeaders.userId = response.data.userId;
    } catch (error) {
      console.error(`Authentication failed: ${error.message}`);
    }


    
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
    this.socket.on('get-todos', (todos: string[]) => {
      console.table(`Received todos: ${JSON.stringify(todos,null, 2)}`);
    });
    return this.socketOptions.transportOptions.polling.extraHeaders.userId
  }

  private disconnect() {
    this.socket.disconnect();
  }

  private getTodos() {
    this.socket.emit('get-todos');
  }
  private createTodo(todo: string) {
    this.socket.emit('create-todos', todo);
  }
  private async signOut() {
    this.disconnect();
    process.exit();
  }

  private prompt(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer: string) => {
        resolve(answer);
      });
    });
  }
}


// Main code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new AppClient(rl);

try {
  client.connect().then((userId) => {
    console.log(userId);
    client.start();
  });
} catch (error) {
  
}