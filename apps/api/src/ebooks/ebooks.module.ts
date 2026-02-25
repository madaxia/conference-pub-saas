import { Module } from '@nestjs/common';
import { EbooksService } from './ebooks.service';

@Module({
  providers: [EbooksService],
  exports: [EbooksService],
})
export class EbookModule {}
