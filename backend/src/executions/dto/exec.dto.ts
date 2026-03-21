import { IsDefined, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Runtime } from 'src/common/enums/runtime.enum';

export class ExecBlockDto {
  @IsNumber()
  @IsDefined()
  sessionId!: number;

  @IsNumber()
  @IsDefined()
  blockIndex!: number;

  @IsNotEmpty()
  @IsEnum(Runtime)
  runtime!: Runtime;
}
