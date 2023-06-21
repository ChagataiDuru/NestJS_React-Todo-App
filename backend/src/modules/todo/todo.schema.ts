import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Document, Types, Schema as MongooseSchema } from 'mongoose'
import { User, UserDocument } from '../user/user.schema'
import { UserDto } from '../user/dtos/user.dto'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export type ToDoDocument = HydratedDocument<ToDo>

@Schema({ collection: 'todos', timestamps: true })
export class ToDo extends Document {
    @Prop()
    todoId: number
    
    @Prop()
    title: string
    
    @Prop()
    description: string
    
    @Prop()
    completed: boolean

    @Prop()
    approved: boolean

    @Prop({type: MongooseSchema.Types.ObjectId , ref: User.name})
    owner: string | Types.ObjectId | UserDocument

}

export const ToDoSchema = SchemaFactory.createForClass(ToDo)