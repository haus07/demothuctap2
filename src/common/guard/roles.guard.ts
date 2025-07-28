import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('Khong co quyen truy cap');
    }

    const userRoles = user.roles.map((r: any) => r.role ?? r); // Nếu user.roles là array object
    const hasRole = userRoles.some((r: number) => requiredRoles.includes(r));

    if (!hasRole) throw new ForbiddenException('Khong co quyen truy cap');

    return true;
  }
}
