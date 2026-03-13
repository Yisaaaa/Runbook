import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContainersModule } from 'src/containers/containers.module';
import { SessionsController } from './sessions.controller';
import { RunbooksModule } from 'src/runbooks/runbooks.module';

@Module({
  providers: [SessionsService],
  exports: [SessionsService],
  imports: [PrismaModule, ContainersModule, RunbooksModule],
  controllers: [SessionsController],
})
export class SessionsModule {}
