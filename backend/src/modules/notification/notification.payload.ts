import { PartialType } from '@nestjs/swagger'
import { NotificationModel } from './notification.schema'

export class NotificationPayload extends PartialType(NotificationModel) {
  createdA?: string
  updateAt?: string
}