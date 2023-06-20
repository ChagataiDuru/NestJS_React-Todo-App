import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ToDoDocument = HydratedDocument<ToDo>

@Schema({ collection: 'todos', timestamps: true })
export class ToDo {
    @Prop()
    todoId: number
    
    @Prop()
    title: string
    
    @Prop()
    description: string
    
    @Prop()
    completed: boolean

    @Prop()
    createdAt: Date
}

export const ToDoSchema = SchemaFactory.createForClass(ToDo)