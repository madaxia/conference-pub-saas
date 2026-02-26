import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EbooksService } from './ebooks.service';

@Controller('ebooks')
export class EbooksController {
  constructor(private ebooksService: EbooksService) {}

  // 公开端点 - 获取电子书列表
  @Get()
  findAll() {
    return this.ebooksService.findAll('default-tenant');
  }

  // 公开端点 - 获取单个电子书
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ebooksService.findOne(id, 'default-tenant');
  }

  // 需要认证 - 用户积分
  @Get('points/my')
  getUserPoints(@Request() req: any) {
    return this.ebooksService.getUserPoints(req.user?.id || 'default-user');
  }

  // 需要认证 - 阅读电子书
  @Post(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.ebooksService.markAsRead(id, req.user?.id || 'default-user');
  }
}
