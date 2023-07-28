export {};
import { UserDto } from "src/todo/dtos/user.dto";

declare module 'express-session' {
    interface SessionData {
        user: UserDto;
        userId: number;
        isAdmin: boolean;
    }
}

declare global {
    namespace Express {
      export interface Request {
        currentUser?: User;
      }
    }
}
