import { Inject, Injectable, Session } from '@nestjs/common';
import { Model } from 'mongoose';

import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
    constructor(@Inject(Notification.name) private readonly notModel: Model<Notification>){}

    async createNotificationsForDueTodos(@Session() session: any) {

    }
}
