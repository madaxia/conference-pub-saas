import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private prisma: PrismaService) {}

  // 辅助方法：检查管理员权限
  private checkAdminRole(user: any) {
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      throw new ForbiddenException('需要管理员权限');
    }
  }

  // 辅助方法：检查超级管理员权限
  private checkSuperAdminRole(user: any) {
    if (user.role !== 'superadmin') {
      throw new ForbiddenException('需要超级管理员权限');
    }
  }

  // Users
  @Get('users')
  async getUsers(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.user.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Post('users/:id/role')
  async updateUserRole(
    @Param('id') id: string, 
    @Body() data: { role: string }, 
    @Request() req: any
  ) {
    this.checkAdminRole(req.user);
    
    // 检查用户是否存在
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('用户不存在');
    }
    
    // 不能修改自己的角色（防止权限提升漏洞）
    if (id === req.user.id) {
      throw new ForbiddenException('不能修改自己的角色');
    }
    
    // 只有superadmin可以设置superadmin
    if (data.role === 'superadmin' && req.user.role !== 'superadmin') {
      throw new ForbiddenException('只有超级管理员可以设置超级管理员角色');
    }
    
    // 同一租户检查
    if (targetUser.tenantId !== req.user.tenantId) {
      throw new ForbiddenException('不能操作其他租户的用户');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: data.role as any },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
      },
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    this.checkAdminRole(req.user);
    
    // 不能删除自己
    if (id === req.user.id) {
      throw new ForbiddenException('不能删除自己的账户');
    }
    
    // 检查用户是否存在
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('用户不存在');
    }
    
    // 同一租户检查
    if (targetUser.tenantId !== req.user.tenantId) {
      throw new ForbiddenException('不能操作其他租户的用户');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: '用户已删除' };
  }

  // Projects
  @Get('projects')
  async getProjects(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.project.findMany({
      where: { tenantId: req.user.tenantId },
      include: { 
        owner: { select: { id: true, name: true, email: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string, @Request() req: any) {
    this.checkAdminRole(req.user);
    
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('项目不存在');
    }
    
    if (project.tenantId !== req.user.tenantId) {
      throw new ForbiddenException('不能操作其他租户的项目');
    }

    await this.prisma.project.delete({ where: { id } });
    return { message: '项目已删除' };
  }

  // Orders
  @Get('orders')
  async getOrders(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.printOrder.findMany({
      where: { tenantId: req.user.tenantId },
      include: { 
        project: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Printers
  @Get('printers')
  async getPrinters(@Request() req: any) {
    this.checkSuperAdminRole(req.user);
    
    return this.prisma.printer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post('printers')
  async createPrinter(@Body() data: any, @Request() req: any) {
    this.checkSuperAdminRole(req.user);
    
    return this.prisma.printer.create({ data });
  }

  @Put('printers/:id')
  async updatePrinter(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    this.checkSuperAdminRole(req.user);
    
    return this.prisma.printer.update({
      where: { id },
      data,
    });
  }

  // Ebooks
  @Get('ebooks')
  async getEbooks(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.ebook.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Knowledge Base
  @Get('knowledge-base')
  async getKnowledgeBase(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.knowledgeBaseItem.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Settings
  @Get('settings')
  async getSettings(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.systemSetting.findMany();
  }

  @Post('settings')
  async setSetting(@Body() data: { key: string; value: string }, @Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.systemSetting.upsert({
      where: { key: data.key },
      update: { value: data.value },
      create: { key: data.key, value: data.value },
    });
  }

  // Grant Points
  @Post('grant-points')
  async grantPoints(
    @Body() data: { userId: string; points: number }, 
    @Request() req: any
  ) {
    this.checkAdminRole(req.user);
    
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    if (user.tenantId !== req.user.tenantId) {
      throw new ForbiddenException('不能操作其他租户的用户');
    }

    // 添加积分
    const updatedUser = await this.prisma.user.update({
      where: { id: data.userId },
      data: { points: { increment: data.points } },
    });
    
    return { message: '积分已添加', newPoints: updatedUser.points };
  }

  // Groups
  @Get('groups')
  async getGroups(@Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.userGroup.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('groups')
  async createGroup(@Body() data: { name: string; description?: string }, @Request() req: any) {
    this.checkAdminRole(req.user);
    
    return this.prisma.userGroup.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id') id: string, @Request() req: any) {
    this.checkAdminRole(req.user);
    
    const group = await this.prisma.userGroup.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException('分组不存在');
    }

    await this.prisma.userGroup.delete({ where: { id } });
    return { message: '分组已删除' };
  }

  // Notifications
  @Post('send-notification')
  async sendNotification(
    @Body() data: { userIds?: string[]; title: string; content: string },
    @Request() req: any
  ) {
    this.checkAdminRole(req.user);
    
    const userIds = data.userIds || [];
    
    // 创建通知
    const notifications = await Promise.all(
      userIds.map(userId => 
        this.prisma.notification.create({
          data: {
            userId,
            title: data.title,
            content: data.content,
            type: 'system',
          },
        })
      )
    );
    
    return { message: `已发送 ${notifications.length} 条通知` };
  }
}
