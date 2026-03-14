import { Module } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { ContainersModule } from 'src/containers/containers.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RunbooksModule } from 'src/runbooks/runbooks.module';

@Module({
  controllers: [ExecutionsController],
  providers: [ExecutionsService],
  imports: [SessionsModule, ContainersModule, RunbooksModule],
})
export class ExecutionsModule {}
