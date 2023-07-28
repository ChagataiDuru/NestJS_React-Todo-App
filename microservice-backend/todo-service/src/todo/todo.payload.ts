import { PartialType } from '@nestjs/swagger'
import { ToDo } from './todo.schema'

export class TodoPayload extends PartialType(ToDo) {
  createdA?: string
  updateAt?: string
}