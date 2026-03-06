import { IsDefined, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsInt()
  @IsDefined()
  userId!: number;

  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  runbookId!: number;
}
