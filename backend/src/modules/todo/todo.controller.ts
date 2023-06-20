import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/guards/auth.guard';
import { TodoService } from './todo.service';
import { ToDo } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: CreateTodoDto, description: 'Successfully created todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async create(@Body() todo: CreateTodoDto) {
        return this.todoService.create(todo);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll() {

        return this.todoService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id') todoId: string) {
        return this.todoService.findOneById(todoId);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: UpdateTodoDto, description: 'Successfully updated todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async update(@Param('id') todoId: string, @Body() todo: ToDo) {
        return this.todoService.update(todoId, todo);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ description: 'Successfully deleted todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async delete(@Param('id') todoId: string): Promise<void> {
        return this.todoService.delete(todoId);
    }
}