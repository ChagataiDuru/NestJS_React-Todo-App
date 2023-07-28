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
      while (option !== '4') {
        console.log('Select an option:');
        console.log('1 - Get all todos');
        console.log('2 - Create todo');
        console.log('3 - Profile');
        console.log('4 - Sign out');
        option = await this.prompt(rl, '');
  
        switch (option) {
          case '1':
            this.getTodos();
            break;
            case '2':
              const todoTitle = await this.prompt(rl, 'Enter todo title: ');
              const todoText = await this.prompt(rl, 'Enter todo text: ');
              let todoDueDate = '';
              let validDate = false;
              while (!validDate) {
                todoDueDate = await this.prompt(rl, 'Enter todo due date (YYYY-MM-DD): ');
                const timestamp = Date.parse(todoDueDate);
                if (isNaN(timestamp)) {
                  console.log("Invalid date format. Please enter a valid date in the format YYYY-MM-DD.");
                } else {
                  validDate = true;
                }
              }
              const dateObject = new Date(todoDueDate);
              const todo = {title: todoTitle, text: todoText, dueDate: dateObject };
              console.log(todo);
              this.createTodo(todo);
              break;
          case '3':
            this.whoAmI();
            break;
          case '4':
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
          extraHeaders: {}
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
    this.socket.on('whoami', (userId: string) => {
      console.log(`Received userId: ${JSON.stringify(userId,null, 2)}`);
    });
    this.socket.on('get-todos', (todos: string[]) => {
      console.table(`Received todos: ${JSON.stringify(todos,null, 2)}`);
    });
    this.socket.on('create-todo', (todo: string) => {
      console.log(`Created todo: ${JSON.stringify(todo,null, 2)}`);
    });
    return this.socketOptions.transportOptions.polling.extraHeaders.userId
  }

  private disconnect() {
    this.socket.disconnect();
  }

  private whoAmI() {
    this.socket.emit('whoami');
  }
  private getTodos() {
    this.socket.emit('get-todos');
  }
  private createTodo(todo: any) {
    this.socket.emit('create-todo', todo);
  }
  private async signOut() {
    console.log('Signing out...');
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