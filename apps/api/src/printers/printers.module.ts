import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { PrinterApplicationsService } from './printer-applications.service';
import { PrinterApplicationsController } from './printer-applications.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'confpub-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PrintersController, PrinterApplicationsController],
  providers: [PrintersService, PrinterApplicationsService],
  exports: [PrintersService, PrinterApplicationsService],
})
export class PrintersModule {}
