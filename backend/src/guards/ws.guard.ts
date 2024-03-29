import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserService } from "../modules/user/user.service";

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();
    const UserId = client.handshake.headers.userid;
    if (!UserId) {
      console.log('no user id')
      return false;
    }
    const user = await this.userService.findOneById(Number(UserId));
    if (!user) {
      return false;
    }
  
    return true;
  }
}