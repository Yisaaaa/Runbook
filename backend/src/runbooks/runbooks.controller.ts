import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RunbooksService } from './runbooks.service';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { CreateRunbookDto } from './dto/create-runbook.dto';
import { RunbookResponseDto } from './dto/runbook-response.dto';

@Controller('runbooks')
export class RunbooksController {
  constructor(private readonly runbooksService: RunbooksService) {}

  @Post()
  create(
    @Body() createRunbookDto: CreateRunbookDto,
  ): Promise<RunbookResponseDto> {
    console.log('Create');
    return this.runbooksService.create(createRunbookDto);
  }

  @Get()
  findAll(): Promise<RunbookResponseDto[]> {
    return this.runbooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runbooksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRunbookDto: UpdateRunbookDto) {
    return this.runbooksService.update(+id, updateRunbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.remove(+id);
  }
}
