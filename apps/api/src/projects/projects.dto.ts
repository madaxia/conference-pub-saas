import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  conferenceName: string;

  @IsDateString()
  issueDate: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  conferenceName?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsEnum(['draft', 'editing', 'reviewing', 'finalizing', 'printing', 'completed'])
  status?: string;
}
