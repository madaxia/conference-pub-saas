import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginDto } from './auth.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 密码强度验证
  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('密码至少需要8个字符');
    }
    // 移除过于严格的验证，允许更多密码格式
  }

  async register(tenantId: string, email: string, password: string, name: string, role?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });

    if (existing) {
      throw new ConflictException('邮箱已被注册');
    }

    // 密码强度验证
    this.validatePassword(password);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        name,
        passwordHash,
        role: (role as UserRole) || 'member',
      },
    });

    return this.generateToken(user);
  }

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

    return this.generateToken(user);
  }

  async validateUser(tenantId: string, email: string, password: string) {
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
