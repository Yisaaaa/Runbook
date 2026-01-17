import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RunbookPrivacy } from 'src/generated/prisma/enums';

export class CreateRunbookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  runtime?: string;

  @IsString()
  content: string;

  @IsEnum(RunbookPrivacy)
  privacy: RunbookPrivacy;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shareToken?: string;
}
