import { Controller, Get, Post, Param, Query, Body, UseGuards, Request, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ExportService } from './export.service';

function extractToken(req: any): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.substring(7);
  return req.query.token || null;
}

@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  private async getTenantId(req: any): Promise<string> {
    const token = extractToken(req);
    if (!token) throw new UnauthorizedException('No token provided');
    
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.tenantId;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get('html/:documentId')
  async exportHtml(@Param('documentId') documentId: string, @Request() req: any, @Res() res: Response) {
    const tenantId = await this.getTenantId(req);
    const result = await this.exportService.exportToHtml(documentId, tenantId);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.html);
  }

  @Get('pdf/:documentId')
  async exportPdf(
    @Param('documentId') documentId: string,
    @Query('pageSize') pageSize?: 'A4' | 'A5' | 'LETTER',
    @Query('orientation') orientation?: 'portrait' | 'landscape',
    @Request() req?: any,
    @Res() res?: Response,
  ) {
    const tenantId = await this.getTenantId(req);
    const result = await this.exportService.exportToPdf(documentId, tenantId, { pageSize, orientation });
    
    // Return as base64 for API call, or as file for direct download
    if (res) {
      const buffer = Buffer.from(result.pdf, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(buffer);
    } else {
      return result;
    }
  }

  // PDF with options via POST
  @Post('pdf/:documentId')
  async exportPdfWithOptions(
    @Param('documentId') documentId: string,
    @Body() options: { pageSize?: 'A4' | 'A5' | 'LETTER'; orientation?: 'portrait' | 'landscape'; margin?: number },
    @Request() req: any,
    @Res() res: Response,
  ) {
    const tenantId = await this.getTenantId(req);
    const result = await this.exportService.exportToPdf(documentId, tenantId, options);
    const buffer = Buffer.from(result.pdf, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(buffer);
  }

  // Batch export
  @Post('batch')
  async exportBatch(@Body() data: { documentIds: string[] }, @Request() req: any) {
    const tenantId = await this.getTenantId(req);
    return this.exportService.exportBatch(data.documentIds, tenantId);
  }

  // Get supported page sizes
  @Get('page-sizes')
  getPageSizes() {
    return this.exportService.getPageSizes();
  }
}
