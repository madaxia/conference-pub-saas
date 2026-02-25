import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserFontsService } from './user-fonts.service';

@Controller('user-fonts')
@UseGuards(AuthGuard('jwt'))
export class UserFontsController {
  constructor(private userFontsService: UserFontsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.userFontsService.findAll(req.user.id);
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.userFontsService.create(data, req.user.id, req.user.tenantId);
  }

  @Get('pending')
  async findPending(@Request() req: any) {
    return this.userFontsService.findPending();
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return this.userFontsService.approve(id);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() data: { note?: string }) {
    return this.userFontsService.reject(id, data.note || '');
  }
}
