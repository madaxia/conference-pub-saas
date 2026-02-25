import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PrintersService } from './printers.service';

@Controller('printers')
export class PrintersController {
  constructor(private printersService: PrintersService) {}

  @Get()
  findAll() {
    return this.printersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.printersService.findById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.printersService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.printersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.printersService.delete(id);
  }

  @Get(':id/orders')
  getOrders(@Param('id') id: string) {
    return this.printersService.getOrders(id);
  }

  @Post(':id/pricing')
  setPricing(@Param('id') id: string, @Body() data: { pricing: any }) {
    return this.printersService.setPricing(id, data.pricing);
  }
}
