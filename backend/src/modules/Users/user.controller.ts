import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from './user.interface';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private usersService: UserService) {}

    @Get()
    async findAll(@Req() request: Request): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() body: CreateUserDto  ) {
        console.log(body)
    }
}