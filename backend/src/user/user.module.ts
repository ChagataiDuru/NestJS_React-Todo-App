import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ModelDefinition, MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { AutoIncrementID, AutoIncrementIDOptions } from '@typegoose/auto-increment'
import AutoIncrementFactory from 'mongoose-sequence'
import mongoose from 'mongoose';


import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User, UserSchema } from './user.schema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
              name: User.name,
              inject: [getConnectionToken()],
              useFactory: (connection: mongoose.Connection): ModelDefinition['schema'] => {
                const schema = UserSchema
                // const plugin = AutoIncrementFactory(connection)
                // schema.plugin(plugin, { inc_field: 'id', id: 'user_id'})
                schema.plugin(AutoIncrementID, { field: 'userId' } as AutoIncrementIDOptions)
                return schema
              }
            }
          ])
    ],
    controllers: [UserController],
    providers: [UserService, AuthService],
})
export class UserModule {}
