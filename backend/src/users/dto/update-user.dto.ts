import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Prisma, User } from 'src/generated/prisma/client';

export class UpdateUserDto {
  // id Int @default(autoincrement()) @id
  // email String @unique
  // name String
  // createdAt DateTime @default(now())
  // passwordHash String
  // runbooks Runbook[]

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  runbooks?: []; //update this to user Runbook type
}
