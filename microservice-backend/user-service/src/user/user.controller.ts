import { Controller, Body, Post, Get, NotFoundException, Param, UseGuards, Session, Delete} from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto'; 
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './user.schema';
import { AdminGuard } from '../guards/admin.guard';


@Controller('auth')
@Serialize(UserDto)
export class UserController {
    constructor(
        private usersService: UserService,
        private authService: AuthService
    ) {}
    
    @UseGuards(AuthGuard)
    async whoAmI(@CurrentUser() user: User) {
      return user;
    }

    @ApiOkResponse({ type: CreateUserDto, description: 'Successfully created user' })
    @ApiBadRequestResponse({ description: 'User with that email already exists.' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      try {
        const user = await this.authService.signUp(body);
        console.log('Signed Up User:', user);
        session.userId = user.userId;
        return user;
      } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    }
  
    @ApiOkResponse({ type: LoginUserDto, description: 'Successfully logged in' })
    @ApiBadRequestResponse({ description: 'Bad credentials' })
    async signin(@Body() body: LoginUserDto, @Session() session: any) {
      const user = await this.authService.signin(body.email, body.password);
      
      session.userId = user.userId;
      session.isAdmin = user.isAdmin;

      return user;
    }

    signOut(@Session() session: any) {
      session.userId = null;
    }

    @UseGuards(AuthGuard)
    async getAllUsers() {
        const user = await this.usersService.findAll();
        if (!user) {
            return new NotFoundException('No users found');
        }
        return user;
    }

    @UseGuards(AdminGuard)
    async getUser(@Param('id') id: string) {
        return await this.usersService.findOneById(Number(id));
    }

    @UseGuards(AdminGuard)
    async deleteUser(@Param('id') id: string) {
        const user = await this.usersService.findOneById(Number(id));
        if (user) {
          return await this.usersService.deleteUser(Number(id));
        }
    }

}
