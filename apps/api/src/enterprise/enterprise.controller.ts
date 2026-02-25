import { Controller, Get, Post, Body } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private es: EnterpriseService) {}

  @Get('my')
  getMyEnterprise() { return null; }

  @Get()
  getAll() { return []; }
}
