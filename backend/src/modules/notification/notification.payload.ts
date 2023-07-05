import { PartialType } from '@nestjs/swagger'
import { Notification } from './notification.schema'

export class NotificationPayload extends PartialType(Notification) {
  createdA?: string
  updateAt?: string
}