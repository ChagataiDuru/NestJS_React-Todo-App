import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ITodo } from './todo.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<ITodo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') id: string): Promise<ITodo> {
    return this.todoService.findOneById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() todo: ITodo): Promise<ITodo> {
    return this.todoService.create(todo);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() todo: ITodo): Promise<ITodo> {
    return this.todoService.update(id, todo);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.todoService.delete(id);
  }
}