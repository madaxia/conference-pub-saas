import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(tenantId: string, email: string, password: string, name: string, role?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });

    if (existing) {
      throw new ConflictException('邮箱已被注册');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        name,
        passwordHash,
        role: (role as any) || 'member',
      },
    });

    return this.generateToken(user);
  }

  // 普通用户登录
  async login(tenantId: string, email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 阻止管理员和印刷厂从用户端登录
    if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'printer') {
      throw new ForbiddenException('请使用正确的登录入口');
    }

    return this.generateToken(user);
  }

  // 管理员登录
  async adminLogin(email: string, password: string) {
    const users = await this.prisma.user.findMany({
      where: {
        email,
        role: { in: ['admin', 'superadmin'] },
      },
    });

    if (!users || users.length === 0) {
      return null;
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValid) {
      return null;
    }

    return this.generateToken(user);
  }

  // 印刷厂登录 - 查找role为printer的用户
  async printerLogin(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, role: 'printer' as any },
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValid) {
      return null;
    }

    return this.generateToken(user);
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException('用户不存在');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      points: user.points,
    };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        points: user.points,
      },
    };
  }
}
