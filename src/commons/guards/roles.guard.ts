import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 유저나 역할이 없으면 접근을 차단
    if (!user || !user.role) {
      console.error('User or role is missing in the request');
      return false; // 혹은 예외를 던질 수도 있음
    }

    return requiredRoles.includes(user.role);
  }
}
