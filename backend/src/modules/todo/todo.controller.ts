import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Session, ParseIntPipe, Query, ParseBoolPipe, Req } from '@nestjs/common';
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
    create(@Body() todo: CreateTodoDto, @Session() session: any) {
        return this.todoService.create(todo, session.userId);
    }

    @Get('/all')
    @UseGuards(AdminGuard)
    findAll() {
        return this.todoService.findAll();
    }

    @Get('/')
    @UseGuards(AuthGuard)
    findMyTodos(@Session() session: any) {
        return this.todoService.findTodosById(session.userId);
    }

    @Get('/main')
    @UseGuards(AuthGuard)
    listApprovedTodos() {
        return this.todoService.listApproveTodos(true);
    }

    @Get('/list/?')
    @UseGuards(AdminGuard)
    findUnApprovedTodos(@Query('approved',ParseBoolPipe) isApproved: boolean) {
        console.log(isApproved)
        return this.todoService.listApproveTodos(isApproved);
    }

    @Put('/:id/?')
    @UseGuards(AuthGuard)
    updateDoneTodo(
    @Req() req: any,
    @Query('completed', ParseBoolPipe) isCompleted: boolean,
    @Query('approved', ParseBoolPipe) isApproved: boolean,
    @Param('id', ParseIntPipe) todoId: number) 
    {
        return this.todoService.updateField(req,todoId,isCompleted,isApproved);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    findOneById(@Param('id',ParseIntPipe) todoId: number) {
        return this.todoService.findTodosById(todoId);
    }

    @Put('/edit/:id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: UpdateTodoDto, description: 'Successfully updated todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    update(@Param('id') todoId: string, @Body() todo: ToDo) {
        return this.todoService.update(todoId, todo);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ description: 'Successfully deleted todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    delete(@Param('id') todoId: string): Promise<void> {
        return this.todoService.delete(todoId);
    }
}