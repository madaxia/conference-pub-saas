import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() data: { documentId: string }, @Request() req: any) {
    return this.reviewsService.create({
      documentId: data.documentId,
      reviewerId: req.user.id,
    });
  }

  @Get('document/:documentId')
  async findByDocument(@Param('documentId') documentId: string) {
    return this.reviewsService.findByDocument(documentId);
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() data: { status: string; decision?: string }) {
    return this.reviewsService.updateStatus(id, data.status, data.decision);
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() data: { content: string }, @Request() req: any) {
    return this.reviewsService.addComment({
      reviewId: id,
      userId: req.user.id,
      content: data.content,
    });
  }
}
