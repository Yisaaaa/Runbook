import { IsEnum } from 'class-validator';
import { Runtime } from 'src/common/enums/runtime.enum';

export class CreateContainerDto {
  @IsEnum(Runtime)
  runtime!: Runtime;
}
