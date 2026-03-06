import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContainersModule } from 'src/containers/containers.module';
import { SessionsController } from './sessions.controller';

@Module({
  providers: [SessionsService],
  exports: [SessionsService],
  imports: [PrismaModule, ContainersModule],
  controllers: [SessionsController],
})
export class SessionsModule {}
