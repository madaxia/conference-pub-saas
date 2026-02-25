import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  tenantId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['member', 'senior_member', 'super_member', 'printer_staff', 'admin'])
  role?: string;
}

export class LoginDto {
  @IsString()
  tenantId: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
