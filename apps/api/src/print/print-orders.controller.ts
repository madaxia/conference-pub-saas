import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrintOrdersService } from './print-orders.service';

@Controller('print-orders')
@UseGuards(AuthGuard('jwt'))
export class PrintOrdersController {
  constructor(private pos: PrintOrdersService) {}

  @Get()
  findAll() { return []; }
}
