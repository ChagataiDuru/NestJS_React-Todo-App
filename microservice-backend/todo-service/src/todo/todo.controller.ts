import {
  Controller,
  Param,
  Body,
  UseGuards,
  Session,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ClientProxy, ClientProxyFactory, MessagePattern,Transport } from '@nestjs/microservices';
import { TodoService } from './todo.service';
import { ToDo } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoDto } from './dtos/todo.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateBoolTodoDto } from './dtos/update-bool.dto';
import session from 'express-session';

@Controller('todos')
@Serialize(TodoDto)
export class TodoController {
  private userClient : ClientProxy
  constructor(private readonly todoService: TodoService) {
    try {
      this.userClient = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: 4002,
        },
      });
    } catch (error) {
      console.error(error.message);
      if (error.code === 'ECONNREFUSED') {
        setTimeout(() => {
          this.userClient = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
              host: process.env.USER_SERVICE_HOST || 'localhost',
              port: 4002,
            },
          });
        }, 5000);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('User service not found');
      } else {
        throw error;
      }
    }
  }

  @MessagePattern({ cmd: 'createTodo' },)
  @ApiOkResponse({
    type: CreateTodoDto,
    description: 'Successfully created todo',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(data: { todo: CreateTodoDto, user: any }) {
    console.log(data);
    return this.todoService.create(data.todo,data.user);
  }

  
  @MessagePattern({ cmd: 'getMessages' })
  getMessages(): string[] {
    return this.todoService.getMessages();
  }

  @MessagePattern({ cmd: 'sendMessage' })
  sendMessage(@Param('message') message: string) {
    this.todoService.sendMessage(message);
  }

  @MessagePattern({ cmd: 'listClients' })
  listClients(): string[] {
    return this.todoService.listClients();
  }

  @MessagePattern({ cmd: 'findAllTodos' })
  findAll() {
    return this.todoService.findAll();
  }

  @MessagePattern({ cmd: 'findMyTodos' })
  async findMyTodos(@Body() user: any) {
    return this.todoService.findOneByOwner(user);
  }

  @MessagePattern({ cmd: 'approvedTodos' })
  listApprovedTodos() {
    return this.todoService.listApproveTodos(true);
  }

  findUnApprovedTodos(isApproved: boolean) {
    console.log(isApproved);
    return this.todoService.listApproveTodos(isApproved);
  }

  updateDoneTodo(data: {dto: UpdateBoolTodoDto,todoId: number,user: any}) {
    return this.todoService.updateField(data.dto, data.todoId , data.user);
  }

  @MessagePattern({ cmd: 'findOneTodo' })
  findOneById(data: {todoId: string}) {
    return this.todoService.findTodosById(data);
  }

  @MessagePattern({ cmd: 'updateTodo' })
  @ApiOkResponse({
    type: UpdateTodoDto,
    description: 'Successfully updated todo',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  update(@Param('id') todoId: string, @Body() todo: ToDo) {
    return this.todoService.update(todoId, todo);
  }

  @MessagePattern({ cmd: 'deleteTodo' })
  @ApiOkResponse({ description: 'Successfully deleted todo' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  delete(@Param('id') todoId: string): Promise<void> {
    return this.todoService.delete(todoId);
  }
}
