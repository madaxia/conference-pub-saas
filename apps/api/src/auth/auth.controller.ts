import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 普通用户登录
  @Post('login')
  async login(@Body() data: { tenantId: string; email: string; password: string }) {
    const result = await this.authService.login(
      data.tenantId || 'default-tenant', 
      data.email, 
      data.password
    );
    // 标记为普通用户
    if (result && result.user) {
      result.user.role = 'member';
    }
    return result;
  }

  // 注册
  @Post('register')
  async register(@Body() data: { tenantId: string; email: string; password: string; name: string; role?: string }) {
    return this.authService.register(
      data.tenantId || 'default-tenant', 
      data.email, 
      data.password, 
      data.name,
      data.role
    );
  }

  // 管理员登录
  @Post('admin-login')
  async adminLogin(@Body() data: { email: string; password: string }) {
    const result = await this.authService.adminLogin(data.email, data.password);
    if (!result) {
      return { message: '管理员账号或密码错误', statusCode: 401 };
    }
    if (result && result.user) {
      result.user.role = 'admin';
    }
    return result;
  }

  // 印刷厂登录
  @Post('printer-login')
  async printerLogin(@Body() data: { email: string; password: string }) {
    const result = await this.authService.printerLogin(data.email, data.password);
    if (!result) {
      return { message: '印刷厂账号或密码错误', statusCode: 401 };
    }
    if (result && result.user) {
      result.user.role = 'printer';
    }
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: any) {
    return this.authService.getUserById(req.user.id);
  }
}
