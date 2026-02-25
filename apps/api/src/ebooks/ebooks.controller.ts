import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EbooksService } from './ebooks.service';

@Controller('ebooks')
@UseGuards(AuthGuard('jwt'))
export class EbooksController {
  constructor(private ebooksService: EbooksService) {}

  @Get()
  findAll() {
    return this.ebooksService.findAll('default-tenant');
  }
}
