import { Controller, Body, Post, Get, NotFoundException, UseInterceptors, Param, UseGuards, Session} from '@nestjs/common';

import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './user.schema';


@Controller('auth')
@Serialize(UserDto)
export class UserController {
    constructor(
        private usersService: UserService,
        private authService: AuthService
    ) {}
    
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
      return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signUp(body.email, body.password);
      session.userId = user._id;
      return user;
    }
  
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signin(body.email, body.password);
      session.userId = user._id;
      return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
      session.userId = null;
    }

    @Get('/users')
    async getAllUsers() {
        const user = this.usersService.findAll();
        if (!user) {
            return new NotFoundException('No users found');
        }
        return user;
    }

    @Get('/users:id')
    async getUser(@Param('id') id: string) {
        const user = this.usersService.findOneById(id);
        if (!user) {
            return new NotFoundException('User not found');
        }
        return user;
    }

}
