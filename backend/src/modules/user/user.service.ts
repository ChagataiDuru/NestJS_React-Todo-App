import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { CreateUserDto,UpdateUserInput } from './dtos/create-user.dto';
import { UserPayload } from './user.payload';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    
      async create(body: any): Promise<User> {
          console.log('The User will saved from request:', body);
          const dto = body.userDto;
          console.log('DTO', dto);
          dto.password = body.password;
          const createdUser = new this.userModel(dto)
          console.log('User to be created to save:', createdUser);
          try {
            console.log('Saving user...');
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
        await this.userModel.updateOne({ userId: id }, body)
        const updatedUser = this.userModel.findById(id)
        return updatedUser
      }
    
      async deleteUser(id: string): Promise<void> {
        await this.userModel.deleteOne({ userId: id })
      }

      async findOneByEmail(email: string): Promise<User> {
          return this.userModel.findOne({email: email}).exec();
        }
      
      async findOneById(id: number): Promise<UserDocument> {
          return this.userModel.findOne({userId: id}).exec();
      }
}