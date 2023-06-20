import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { User } from '../user.schema';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId || {};
    if (typeof userId === 'number') {
      const user = await this.usersService.findOneById(userId);
      console.log('User from current user middleware:', user);
      req.currentUser = user;
    }else{
      req.currentUser = null;
    }

    next();
  }
}
