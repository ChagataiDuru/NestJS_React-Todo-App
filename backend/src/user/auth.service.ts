import { BadRequestException, Body, Injectable, NotFoundException, Session, UnauthorizedException } from "@nestjs/common";
import { randomBytes,scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from "./dtos/create-user.dto";

import { UserService } from "./user.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UserService) {}

    async signUp(email: string, pass: string) {
        const user = await this.usersService.findOneByEmail(email);
        if(user){
            throw new BadRequestException('User already exists');
        }
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(pass, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');

        const userDto = plainToClass(CreateUserDto, {email, password: result});

        const newUser = await this.usersService.create(userDto);
        return newUser;
    }
    
    async signin(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
          throw new NotFoundException('user not found');
        }
    
        const [salt, storedHash] = user.password.split('.');
    
        const hash = (await scrypt(password, salt, 32)) as Buffer;
    
        if (storedHash !== hash.toString('hex')) {
          throw new BadRequestException('bad password');
        }

        return user;
    }
}