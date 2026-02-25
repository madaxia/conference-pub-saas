import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private ns: NotificationsService) {}

  @Get()
  findByUser() {
    return this.ns.findByUser('current-user');
  }

  @Post()
  create(@Body() data: any) {
    return this.ns.create(data);
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.ns.markAsRead(id);
  }
}
