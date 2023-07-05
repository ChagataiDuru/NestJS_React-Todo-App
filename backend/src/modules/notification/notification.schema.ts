import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Document, Types, Schema as MongooseSchema } from 'mongoose'
import { User, UserDocument } from '../user/user.schema'
import { ToDo, ToDoDocument } from '../todo/todo.schema'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({ collection: 'notifications', timestamps: true })
export class Notification extends Document {
    @Prop()
    notificationId: number
    
    @Prop()
    title: string
    
    @Prop()
    body: string
    
    @Prop()
    userType: {
        type: String,
        enum : ['user','admin'],
        default: 'user'
    }

    @Prop({type: MongooseSchema.Types.ObjectId , ref: User.name})
    user: string | Types.ObjectId | UserDocument

    @Prop({type: MongooseSchema.Types.ObjectId , ref: ToDo.name})
    todo: string | Types.ObjectId | ToDoDocument

}

export const ToDoSchema = SchemaFactory.createForClass(Notification)