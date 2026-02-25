import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller('knowledge-base')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeBaseController {
  constructor(private kbService: KnowledgeBaseService) {}

  // Upload item
  @Post()
  async upload(@Body() data: {
    title: string;
    description?: string;
    type: 'document' | 'image' | 'text';
    fileUrl?: string;
    content?: string;
    tags: string[];
    fileSize?: number;
    mimeType?: string;
  }, @Request() req: any) {
    return this.kbService.uploadItem({
      ...data,
      uploadedBy: req.user.id,
    });
  }

  // Get all items
  @Get()
  async getItems(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.kbService.getItems({ type, status, tag, search });
  }

  // Get single item
  @Get(':id')
  async getItem(@Param('id') id: string) {
    return this.kbService.getItem(id);
  }

  // Update item
  @Put(':id')
  async updateItem(@Param('id') id: string, @Body() data: {
    title?: string;
    description?: string;
    tags?: string[];
  }) {
    return this.kbService.updateItem(id, data);
  }

  // Delete item
  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    return this.kbService.deleteItem(id);
  }

  // Get all tags
  @Get('tags/all')
  async getTags() {
    return this.kbService.getAllTags();
  }

  // Re-vectorize
  @Post(':id/vectorize')
  async reVectorize(@Param('id') id: string) {
    return this.kbService.reVectorize(id);
  }

  // Get stats
  @Get('stats/summary')
  async getStats() {
    return this.kbService.getStats();
  }
}
