import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private usersService: UserService) {}

    @Get()
    async findAll(@Req() request: Request): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    create(): string {
    return 'This action adds a new user';
    }
}