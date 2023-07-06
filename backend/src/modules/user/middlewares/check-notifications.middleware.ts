import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CheckUserNotificationsMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId || {};
    if (typeof userId === 'number') {
      const user = await this.userService.findOneById(userId)
      console.log(user.notifications || [])
    }
    next();
  }
}
