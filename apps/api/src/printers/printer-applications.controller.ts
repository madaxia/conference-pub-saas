import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrinterApplicationsService } from './printer-applications.service';

@Controller('printer-applications')
export class PrinterApplicationsController {
  constructor(private appsService: PrinterApplicationsService) {}

  @Post()
  apply(@Body() data: any) {
    return this.appsService.apply(data);
  }

  @Get()
  findAll(@Body() data?: { status?: string }) {
    return this.appsService.findAll(data?.status);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.appsService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.appsService.reject(id);
  }
}
