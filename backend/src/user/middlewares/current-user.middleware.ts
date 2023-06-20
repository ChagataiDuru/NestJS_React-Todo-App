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
    console.log('Request session:', req.session);
    console.log('Request session user id:', req.session.userId);
    const userId = req.session.userId || {};
    console.log('User Id from current user middleware:', userId);
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
