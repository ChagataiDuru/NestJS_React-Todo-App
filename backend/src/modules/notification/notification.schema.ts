import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Document, Types, Schema as MongooseSchema } from 'mongoose'

export type NotificationDocument = HydratedDocument<NotificationModel>

@Schema({ collection: 'notifications', timestamps: true })
export class NotificationModel extends Document {
    @Prop()
    notificationId: number
    
    @Prop()
    title: string
    
    @Prop()
    body: string
    
    @Prop({
        type: String,
        enum: ['minor','medium','major','critical'],
        default: 'minor'
    })
    notificationType: string

}

export const NotificationSchema = SchemaFactory.createForClass(NotificationModel)