import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RunbookResponseDto } from './dto/runbook-response.dto';
import { toRunbookResponseDto } from './mapper/runbook.mapper';
import { CreateRunbookDto } from './dto/create-runbook.dto';

@Injectable()
export class RunbooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRunbookDto: CreateRunbookDto,
  ): Promise<RunbookResponseDto> {
    const runbook = await this.prismaService.runbook.create({
      data: createRunbookDto,
      include: { user: { select: { username: true } } },
    });

    return toRunbookResponseDto(runbook);
  }

  async findAll(): Promise<RunbookResponseDto[]> {
    const runbooks = await this.prismaService.runbook.findMany({
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return runbooks.map((rb) => toRunbookResponseDto(rb));
  }

  findOne(id: number) {
    const runbook = this.prismaService.runbook.findUnique({
      where: { id },
    });

    if (!runbook) {
      throw new NotFoundException('Runbook not found');
    }

    return runbook;
  }

  update(id: number, updateRunbookDto: UpdateRunbookDto) {
    return `This action updates a #${id} runbook`;
  }

  remove(id: number) {
    return `This action removes a #${id} runbook`;
  }
}
