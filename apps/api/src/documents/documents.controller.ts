import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  async create(@Body() data: { projectId: string; title: string; content?: any }, @Request() req: any) {
    return this.documentsService.create(data, req.user.id);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string, @Request() req: any) {
    return this.documentsService.findByProject(projectId, req.user.tenantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Request() req: any) {
    return this.documentsService.findById(id, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: { title?: string; content?: any; status?: string }, @Request() req: any) {
    return this.documentsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.documentsService.delete(id);
  }
}
