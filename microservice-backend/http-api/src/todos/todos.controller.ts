import {
    Controller,
    Logger,
    Get,
    Post,
    Delete,
    Query,
    Param,
    Body,
  } from '@nestjs/common';
  import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
  } from '@nestjs/microservices';
  import { TodoDto } from './todo.dto';
  import { CreateTodoDto } from './create-todo.dto';
  
  @Controller('todos')
  export class TodosController {
    client: ClientProxy;
    logger = new Logger('Todos');
    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        },
      });
    }
  
    @Get()
    async getTodos() {
      this.logger.log('Getting all Todos');
      const pattern = { cmd: 'getTodos' };
      return await this.client.send(pattern, {});
    }
  
    @Get(':TodoID')
    async getTodo(@Param('TodoID') TodoID) {
      this.logger.log(TodoID);
      const pattern = { cmd: 'getTodoById' };
      return await this.client.send<number>(pattern, TodoID);
    }
  
    @Post()
    async addTodo(@Body() createTodoDTO: CreateTodoDto) {
      this.logger.log(createTodoDTO);
      const Todo = await this.client.send<CreateTodoDto>(
        { cmd: 'addTodo' },
        createTodoDTO,
      );
      return Todo;
    }
  
    @Delete()
    async deleteTodo(@Query() query) {
      const Todos = await this.client.send({ cmd: 'deleteTodo' }, query);
      return 0;
    }
  }