import { Injectable } from '@nestjs/common';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { RunbookUncheckedCreateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RunbooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRunbookDto: RunbookUncheckedCreateInput) {
    return await this.prismaService.runbook.create({ data: createRunbookDto });
  }

  async findAll() {
    return await this.prismaService.runbook.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} runbook`;
  }

  update(id: number, updateRunbookDto: UpdateRunbookDto) {
    return `This action updates a #${id} runbook`;
  }

  remove(id: number) {
    return `This action removes a #${id} runbook`;
  }
}
