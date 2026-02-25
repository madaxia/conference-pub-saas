import { Module } from '@nestjs/common';
import { PrintOrdersService } from './print-orders.service';
import { PrintOrdersController } from './print-orders.controller';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [PrintOrdersController],
  providers: [PrintOrdersService],
  exports: [PrintOrdersService],
})
export class PrintOrdersModule {}
