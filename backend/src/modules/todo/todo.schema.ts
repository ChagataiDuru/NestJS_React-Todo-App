import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Document, Types, Schema as MongooseSchema } from 'mongoose'

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

    @Prop({type: MongooseSchema.Types.ObjectId , ref: 'User'})
    owner: Types.ObjectId

}

export const ToDoSchema = SchemaFactory.createForClass(ToDo)