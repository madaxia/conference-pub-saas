import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';

@Module({
  providers: [EnterpriseService],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
