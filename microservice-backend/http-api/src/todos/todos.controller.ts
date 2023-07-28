import {
    Controller,
    Logger,
    Get,
    Post,
    Delete,
    Query,
    Param,
    Body,
    Inject,
    ParseBoolPipe,
    ParseIntPipe,
    Put,
    Req,
    Session,
    UseGuards,
  } from '@nestjs/common';
  import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
  } from '@nestjs/microservices';
  import { TodoDto } from './todo.dto';
  import { CreateTodoDto } from './create-todo.dto';
import { ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
  
  @Controller('todo')
  export class TodosController {
    logger = new Logger('Todos');
    constructor(@Inject('TODO_SERVICE') private client: ClientProxy) {}

    @Post('/create')
    @UseGuards(AuthGuard)
    @ApiOkResponse({
      type: CreateTodoDto,
      description: 'Successfully created todo',
    })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async create(@Body() todo: CreateTodoDto, @Session() session: any){
      const createdTodo = await new Promise<TodoDto>((resolve, reject) => {
        this.client.send({ cmd: 'createTodo' }, {todo: todo,user: session.user},).subscribe({
          next: (createdTodo: TodoDto) => {
            resolve(createdTodo);
          },
          error: (error: any) => {
            reject(error);
          },
        });
      });
      return createdTodo;
    }

    @Get('/all')
    //@UseGuards(AdminGuard)
    findAll() {
      return this.client.send({cmd: 'findAllTodos'},{});
    }
  
    @Get('/')
    //@UseGuards(AuthGuard)
    async findMyTodos(@Session() session: any) {
      return this.client.send({cmd: 'findMyTodos'},session.user)
    }
  
    @Get('/main')
    @UseGuards(AuthGuard)
    listApprovedTodos() {
      return this.client.send({cmd: 'approvedTodos'},{});
    }
  
/*     @Get('/list/?')
    @UseGuards(AdminGuard)
    findUnApprovedTodos(@Query('approved', ParseBoolPipe) isApproved: boolean) {
      console.log(isApproved);
      return this.todoServiceproveTodos(isApproved);
    }
  
    @Put('/:id/?')
    @UseGuards(AuthGuard)
    updateDoneTodo(@Body() dto: UpdateBoolTodoDto,@Req() req: any, @Param('id', ParseIntPipe) todoId: number) {
      return this.todoServiceField(req, todoId,dto);
    } */
  
    @Get('/:id')
    @UseGuards(AuthGuard)
    findOneById(@Param('id', ParseIntPipe) todoId: number) {
      return this.client.send({cmd: 'findOneTodo'},todoId);
    }
  
    @Put('/edit/:id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({description: 'Successfully updated todo',})
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    update(@Param('id') todoId: string, @Body() todo: TodoDto) {
      return this.client.send(todoId, todo);
    }
  
    @Delete('/:id')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ description: 'Successfully deleted todo' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    delete(@Param('id') todoId: string){
      return this.client.send({cmd: 'a'},{});
    }
  }