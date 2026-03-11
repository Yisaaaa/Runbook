import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RunbookResponseDto } from './dto/runbook-response.dto';
import { toRunbookResponseDto } from './mapper/runbook.mapper';
import { CreateRunbookDto } from './dto/create-runbook.dto';
import { RunbookWithUser } from './mapper/runbook.mapper';
import { RunbookUncheckedCreateInput } from 'src/generated/prisma/models';

@Injectable()
export class RunbooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRunbookDto: CreateRunbookDto,
    userId: number,
  ): Promise<RunbookResponseDto> {
    const data: RunbookUncheckedCreateInput = {
      title: createRunbookDto.title,
      content: createRunbookDto.content,
      privacy: createRunbookDto.privacy,
      userId,
    };

    if (createRunbookDto.runtime !== undefined) {
      data.runtime = createRunbookDto.runtime;
    }

    if (createRunbookDto.shareToken !== undefined) {
      data.shareToken = createRunbookDto.shareToken;
    }

    const runbook = await this.prismaService.runbook.create({
      data,
      include: { user: { select: { username: true } } },
    });

    return toRunbookResponseDto(runbook);
  }

  async findAll(): Promise<RunbookResponseDto[]> {
    const runbooks: RunbookWithUser[] =
      await this.prismaService.runbook.findMany({
        include: {
          user: {
            select: { username: true },
          },
        },
      });

    return runbooks.map((rb) => toRunbookResponseDto(rb));
  }

  async findOne(id: number) {
    const runbook: RunbookWithUser | null =
      await this.prismaService.runbook.findUnique({
        where: { id },
        include: { user: { select: { username: true } } },
      });

    if (!runbook) {
      throw new NotFoundException('Runbook not found');
    }

    return toRunbookResponseDto(runbook);
  }

  async update(id: number, updateRunbookDto: UpdateRunbookDto) {
    const runbook = await this.prismaService.runbook.update({
      where: { id },
      data: updateRunbookDto,
      include: { user: { select: { username: true } } },
    });

    return toRunbookResponseDto(runbook);
  }

  remove(id: number) {
    return `This action removes a #${id} runbook`;
  }

  async getRunbookRunnableBlocks(id: number) {
    const runbook = await this.prismaService.runbook.findUnique({
      where: { id },
      select: { content: true },
    });

    if (!runbook) {
      throw new NotFoundException('Runbook not found');
    }

    const runnableBlocks: { code: string; index: number }[] = [];
    const contentLines = runbook.content.split('\n');
    let runnableBlockStart = -1;
    let currentIndex = 0;

    for (let line = 0; line < contentLines.length; line++) {
      const contentLine = contentLines[line];

      if (contentLine.startsWith('```runnable')) {
        runnableBlockStart = line + 1;
      } else if (runnableBlockStart !== -1 && contentLine.startsWith('```')) {
        const runnableBlock = contentLines
          .slice(runnableBlockStart, line)
          .join('\n');

        const cleaned = runnableBlock
          .replace(/\r\n/g, '\n')
          .replace(/\s+$/, '')
          .trim();
        runnableBlocks.push({ code: cleaned, index: currentIndex });
        runnableBlockStart = -1;
        currentIndex++;
      }
    }

    console.log(runnableBlocks);

    return runnableBlocks;
  }
}
