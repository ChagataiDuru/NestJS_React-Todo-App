import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TodoService } from './todo.service';
import { ToDo } from './todo.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ToDo, description: 'Successfully created todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    
    async create(@Body() todo: ToDo): Promise<ToDo> {
        return this.todoService.create(todo);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(): Promise<ToDo[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id') id: string): Promise<ToDo> {
        return this.todoService.findOneById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() todo: ToDo): Promise<ToDo> {
        return this.todoService.update(id, todo);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string): Promise<void> {
        return this.todoService.delete(id);
    }
}