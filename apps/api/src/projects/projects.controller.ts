import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.tenantId, req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findById(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.projectsService.create(data, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.projectsService.update(id, data, req.user.id, req.user.tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.delete(id, req.user.id, req.user.tenantId);
  }
}
