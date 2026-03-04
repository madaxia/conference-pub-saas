import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentsPdfController } from './documents-pdf.controller';
import { DocumentsPdfService } from './documents-pdf.service';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  ],
  controllers: [DocumentsController, DocumentsPdfController],
  providers: [DocumentsService, DocumentsPdfService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
