import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Session } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/guards/auth.guard';
import { TodoService } from './todo.service';
import { ToDo } from './todo.schema';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoDto } from './dtos/todo.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('todos')
@Serialize(TodoDto)
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post('/create')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: CreateTodoDto, description: 'Successfully created todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async create(@Body() todo: CreateTodoDto, @Session() session: any) {
        return this.todoService.create(todo, session.user);
    }

    @Get('/all')
    @UseGuards(AdminGuard)
    async findAll() {
        return this.todoService.findAll();
    }

    @Get('/my')
    @UseGuards(AuthGuard)
    async findMyTodos(@Session() session: any) {
        return this.todoService.findTodosById(session.userId);
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

    @Get('/main')
    @UseGuards(AuthGuard)
    async search(@Session() session: any) {
        return this.todoService.findApprovedTodos();
    }

}