import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  content?: any;
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
  templateId?: string;

  @IsOptional()
  @IsEnum(['draft', 'review', 'frozen', 'printing'])
  status?: string;
}

export class CreateRevisionDto {
  @IsObject()
  content: any;

  @IsOptional()
  @IsString()
  changeNote?: string;
}
