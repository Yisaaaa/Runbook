import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getActiveSessions(userId: number, runbookId: number): Promise<number> {
    return 0;
  }

  async createSession(userId: number, runbookId: number): Promise<number> {
    return 0;
  }

  async endSession(sessionId: number): Promise<void> {}

  async expireSessions(): Promise<void> {
    // This method will be called by a cron job to mark sessions as expired after 30 mins of inactivity.
  }

  async updateLastActivity(sessionId: number): Promise<void> {}
}
