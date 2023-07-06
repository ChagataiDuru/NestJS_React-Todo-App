import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken, ModelDefinition } from '@nestjs/mongoose';
import { AutoIncrementID, AutoIncrementIDOptions } from '@typegoose/auto-increment';
import mongoose from 'mongoose';

import { NotificationService } from './notification.service';
import { NotificationModel, NotificationSchema } from './notification.schema';

@Module({
  imports: [    
    MongooseModule.forFeatureAsync([
    {
      name: NotificationModel.name,
      inject: [getConnectionToken()],
      useFactory: (connection: mongoose.Connection): ModelDefinition['schema'] => {
        const schema = NotificationSchema
        schema.plugin(AutoIncrementID, { field: 'notificationId' } as AutoIncrementIDOptions)
        return schema
      }
    }
  ]),
],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
