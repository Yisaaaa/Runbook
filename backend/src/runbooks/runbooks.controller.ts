import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RunbooksService } from './runbooks.service';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { CreateRunbookDto } from './dto/create-runbook.dto';
import { RunbookResponseDto } from './dto/runbook-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import type { JwtPayload } from 'src/auth/auth.types';

@Controller('runbooks')
export class RunbooksController {
  constructor(private readonly runbooksService: RunbooksService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createRunbookDto: CreateRunbookDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<RunbookResponseDto> {
    console.log('Create ', user);
    return this.runbooksService.create(createRunbookDto, user.sub);
  }

  @Get()
  findAll(): Promise<RunbookResponseDto[]> {
    return this.runbooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runbooksService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRunbookDto: UpdateRunbookDto) {
    return this.runbooksService.update(+id, updateRunbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.remove(+id);
  }
}
