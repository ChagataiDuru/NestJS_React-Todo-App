import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    
    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        try {
          const savedUser = await createdUser.save();
          console.log('User saved:', savedUser);
          return savedUser;
        } catch (error) {
          console.error('Error saving user:', error);
          throw error;
        }
      }
    
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
      }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email: email}).exec();
      }
    
    async findOneById(id: string): Promise<User> {
        return this.userModel.findOne({id: id}).exec();
      }
}
