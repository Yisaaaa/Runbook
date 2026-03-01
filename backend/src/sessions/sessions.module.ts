import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SessionsService],
  exports: [SessionsService],
  imports: [PrismaModule],
})
export class SessionsModule {}
