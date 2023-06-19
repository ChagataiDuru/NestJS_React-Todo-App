import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './user.schema';
import { CreateUserDto,UpdateUserInput } from './dtos/create-user.dto';
import { UserPayload } from './user.payload';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    
      async create(body: CreateUserDto): Promise<UserPayload> {
          const createdUser = new this.userModel(body)
          try {
            const user = await createdUser.save()
            console.log('User saved:', user);
            return user;
          } catch (error) {
            console.error('Error saving user:', error);
            throw error;
          }
        }
      
      async findUser(id: string): Promise<UserPayload> {
        const user = await this.userModel.findOne({ _id: id }).exec()
    
        if (!user) {
          throw new NotFoundException(`User with email id:${id} not found `)
        }
        return user
      }
    
      async findAll(): Promise<UserPayload[]> {
        const users = await this.userModel.find()
        return users
      }
    
      async updateUser(id: string, body: UpdateUserInput): Promise<UserPayload> {
        await this.userModel.updateOne({ _id: id }, body)
        const updatedUser = this.userModel.findById(id)
        return updatedUser
      }
    
      async deleteUser(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id })
      }

      async findOneByEmail(email: string): Promise<User> {
          return this.userModel.findOne({email: email}).exec();
        }
      
      async findOneById(id: string): Promise<User> {
          return this.userModel.findOne({id: id}).exec();
        }
}
