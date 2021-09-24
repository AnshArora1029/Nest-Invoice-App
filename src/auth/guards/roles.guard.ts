import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/users/models/users.entity';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    const temp = await this.userService.findOne(user.id);
    const hasRole = roles.indexOf(temp.role);
    if (hasRole === -1) {
      const hasPermission = false;
      return hasPermission;
    }
    const hasPermission = true;
    delete temp.password;
    return temp && hasPermission;
  }
}
