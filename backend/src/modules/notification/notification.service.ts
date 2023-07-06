import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { NotificationModel } from './notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationPayload } from './notification.payload';
import { ToDoDocument } from '../todo/todo.schema';
import { User } from '../user/user.schema';

@Injectable()
export class NotificationService {
    constructor(@InjectModel(NotificationModel.name) private readonly notModel: Model<NotificationModel>){}



    async createNotificationsForDueTodos(todos: ToDoDocument[],user: User): Promise<NotificationPayload[]> {
        for (var todo of todos) {
            const notification = new this.notModel({
                title: todo.title,
                body: `The todo ${todo.title} is due`,
                notificationType: "major",
            });
            await notification.save();
            const id = (await this.notModel.findOne({title: notification.title}).exec()).notificationId
            console.log('Notification id:', id);
            user.notifications.push(id);
        }

        return this.notModel.find({}).exec();
    }

    async deleteNotification(id: number): Promise<void> {
        await this.notModel.deleteOne({ notificationId: id }).exec();
    }

}
