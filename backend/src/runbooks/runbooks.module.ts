import { Module } from '@nestjs/common';
import { RunbooksService } from './runbooks.service';
import { RunbooksController } from './runbooks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RunbooksController],
  providers: [RunbooksService],
  exports: [RunbooksService],
  imports: [PrismaModule],
})
export class RunbooksModule {}
