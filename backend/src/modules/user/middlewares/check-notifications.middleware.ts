import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { NotificationService } from 'src/modules/notification/notification.service';
import { TodoService } from 'src/modules/todo/todo.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CheckUserNotificationsMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private todoService: TodoService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId || {};
    if (typeof userId === 'number') {
      const user = await this.userService.findOneById(userId)
      console.log(user.notifications || [])
      const todos = await this.todoService.findOneByOwner(user);
      const dueTodos = todos.filter((todo) => todo.due < new Date());
      const approvedTodos = todos.filter((todo) => todo.approved);
      this.notificationService.createNotificationsForDueTodos(dueTodos,user);
      this.notificationService.createNotificationsForApprovedTodos(approvedTodos,user);
    }

    next();
  }
}
