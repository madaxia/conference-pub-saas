import { Controller, Post, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsPdfService } from './documents-pdf.service';

@Controller('documents')
export class DocumentsPdfController {
  constructor(private documentsPdfService: DocumentsPdfService) {}

  @Post('analyze-pdf')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async analyzePdf(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are accepted');
    }

    return this.documentsPdfService.analyzePdf(file.buffer);
  }
}
