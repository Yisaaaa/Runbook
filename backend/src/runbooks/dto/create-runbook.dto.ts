import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RunbookPrivacy } from 'src/generated/prisma/enums';

export class CreateRunbookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  runtime: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(RunbookPrivacy)
  privacy: RunbookPrivacy;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shareToken?: string;

  @IsNumber()
  userId: number;
}
