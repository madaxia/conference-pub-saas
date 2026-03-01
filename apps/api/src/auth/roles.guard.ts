import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export enum UserRole {
  MEMBER = 'member',      // 普通用户
  ADMIN = 'admin',        // 总后台管理员
  SUPERADMIN = 'superadmin', // 超级管理员
  PRINTER = 'printer',    // 印刷厂
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('请先登录');
    }

    // 超级管理员可以访问所有
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    // 检查角色权限
    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('权限不足，您无法访问此页面');
    }

    return true;
  }
}

// 装饰器帮助函数
export const RequireRoles = (...roles: UserRole[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  };
};
