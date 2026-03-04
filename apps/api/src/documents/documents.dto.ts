import { IsString, IsOptional, IsObject, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsString()
  templateId?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsString()
  status?: string;
}

export class PageContentDto {
  @IsNumber()
  pageNumber: number;

  @IsObject()
  elements: any[];
}

export class DocumentWithPagesDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageContentDto)
  pages?: PageContentDto[];
}
