import { Controller, Get, Post, Param, Body, UseGuards, Request, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('page-sizes')
  getPageSizes() {
    return {
      pageSizes: [
        { name: 'A4', width: 595, height: 842 },
        { name: 'A5', width: 420, height: 595 },
        { name: 'Letter', width: 612, height: 792 },
      ],
    };
  }

  @Post('pdf')
  async exportPdf(@Body() data: { canvasData: any }, @Request() req: any) {
    return this.exportService.exportToPdf(data.canvasData);
  }
}
