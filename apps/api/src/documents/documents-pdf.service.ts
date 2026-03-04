import { Injectable } from '@nestjs/common';

interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  textContent?: string;
}

export interface PdfAnalysisResult {
  pageCount: number;
  pages: PageInfo[];
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
  fileSize: number;
}

@Injectable()
export class DocumentsPdfService {
  async analyzePdf(buffer: Buffer): Promise<PdfAnalysisResult> {
    // 动态导入 pdf-parse
    const pdfParse = require('pdf-parse');
    
    try {
      const data = await pdfParse(buffer);
      
      const pages: PageInfo[] = [];
      const numPages = data.numpages;
      
      const fullText = data.text || '';
      const textPerPage = fullText.split(/\n\n/).filter((t: string) => t.trim());
      const estimatedTextPerPage = Math.ceil(textPerPage.length / numPages);
      
      for (let i = 1; i <= numPages; i++) {
        const pageText = textPerPage.slice(
          (i - 1) * estimatedTextPerPage, 
          i * estimatedTextPerPage
        ).join('\n\n');
        
        pages.push({
          pageNumber: i,
          width: 595,
          height: 842,
          textContent: pageText.substring(0, 1000),
        });
      }
      
      const result: PdfAnalysisResult = {
        pageCount: numPages,
        pages,
        fileSize: buffer.length,
      };
      
      if (data.metadata) {
        result.metadata = {
          title: data.metadata.Title,
          author: data.metadata.Author,
          subject: data.metadata.Subject,
          creator: data.metadata.Creator,
          producer: data.metadata.Producer,
          creationDate: data.metadata.CreationDate,
          modificationDate: data.metadata.ModDate,
        };
      }
      
      return result;
    } catch (error) {
      console.error('PDF analysis error:', error);
      throw error;
    }
  }
}
