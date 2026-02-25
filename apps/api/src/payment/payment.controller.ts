import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private ps: PaymentService) {}

  @Get('packages')
  getPackages() { return this.ps.getPackages(); }

  @Get('points')
  getPoints() { return { points: 0 }; }
}
