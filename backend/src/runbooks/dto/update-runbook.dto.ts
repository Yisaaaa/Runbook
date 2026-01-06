import { PartialType } from '@nestjs/mapped-types';
import { CreateRunbookDto } from './create-runbook.dto';

export class UpdateRunbookDto extends PartialType(CreateRunbookDto) {}
