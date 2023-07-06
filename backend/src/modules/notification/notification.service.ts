import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { NotificationModel } from './notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationPayload } from './notification.payload';
import { ToDoDocument } from '../todo/todo.schema';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class NotificationService {
    constructor(@InjectModel(NotificationModel.name) 
                private readonly notModel: Model<NotificationModel>,    
                ){}

    async findAll(): Promise<NotificationPayload[]> {
        return this.notModel.find({}).exec();
    }

    async findUserNotification(id: number): Promise<NotificationPayload> {
        return this.notModel.findOne({ notificationId: id }).exec();
    }

    async createNotificationsForDueTodos(todos: ToDoDocument[],user: UserDocument): Promise<NotificationPayload[]> {
        for (var todo of todos) {
            const not = this.notModel.findOne({title: todo.title}).exec();
            if(!not){
                const notification = new this.notModel({
                    title: todo.title,
                    body: `The todo ${todo.title} is due`,
                    notificationType: "major",
                });
                await notification.save();
                const id = (await this.notModel.findOne({title: notification.title}).exec()).notificationId
                console.log('Notification id:', id);
                user.notifications.push(id);
                user.save();
            }
        }
        return this.notModel.find({}).exec();
    }

    async createNotificationsForApprovedTodos(todos: ToDoDocument[],user: UserDocument): Promise<NotificationPayload[]> {
        for (var todo of todos) {
            const notification = new this.notModel({
                title: todo.title,
                body: `The todo ${todo.title} is approved`,
                notificationType: "minor",
            });
            await notification.save();
            const id = (await this.notModel.findOne({title: notification.title}).exec()).notificationId
            console.log('Notification id:', id);
            user.notifications.push(id);
            user.save();
        }
        return this.notModel.find({}).exec();
    }

    async findTodoNotification(title: string): Promise<NotificationPayload> {
        return this.notModel.findOne({ title: title }).exec();
    }

    async deleteNotification(id: number): Promise<void> {
        await this.notModel.deleteOne({ notificationId: id }).exec();
    }

}
