import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() data: any, @Request() req: any) {
    return this.templatesService.create({ ...data, tenantId: req.user.tenantId });
  }

  @Get()
  async findAll(@Query('tenantId') tenantId?: string) {
    return this.templatesService.findAll(tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.templatesService.delete(id, req.user.tenantId);
  }

  // Redeem template with points
  @Post(':id/redeem')
  @UseGuards(AuthGuard('jwt'))
  async redeem(@Param('id') id: string, @Request() req: any) {
    return this.templatesService.redeem(id, req.user.id);
  }

  // Check if user has purchased
  @Get(':id/purchased')
  @UseGuards(AuthGuard('jwt'))
  async hasPurchased(@Param('id') id: string, @Request() req: any) {
    const purchased = await this.templatesService.hasPurchased(id, req.user.id);
    return { purchased };
  }

  // Get user's points
  @Get('user/points')
  @UseGuards(AuthGuard('jwt'))
  async getUserPoints(@Request() req: any) {
    return this.templatesService.getUserPoints(req.user.id);
  }

  // Get user's purchased templates
  @Get('user/purchases')
  @UseGuards(AuthGuard('jwt'))
  async getUserPurchases(@Request() req: any) {
    return this.templatesService.getUserPurchases(req.user.id);
  }

  // Add points to user (admin)
  @Post('user/:userId/add-points')
  @UseGuards(AuthGuard('jwt'))
  async addPoints(@Param('userId') userId: string, @Body() data: { points: number }) {
    return this.templatesService.addPoints(userId, data.points);
  }
}
