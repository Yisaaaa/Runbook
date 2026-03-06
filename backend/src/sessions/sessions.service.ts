import { Injectable } from '@nestjs/common';
import { ContainersService } from 'src/containers/containers.service';
import { Session, SessionStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly containersService: ContainersService,
  ) {}

  async getActiveSession(
    userId: number,
    runbookId: number,
  ): Promise<Session | null> {
    return this.prismaService.session.findFirst({
      where: {
        status: SessionStatus.ACTIVE,
        lastActivityAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // sessions active in the last 30 mins
        },
        userId,
        runbookId,
      },
    });
  }

  async createSession(data: CreateSessionDto): Promise<Session> {
    const containerId: string = await this.containersService.createContainer();

    const session = await this.prismaService.session.create({
      data: {
        userId: data.userId,
        runbookId: data.runbookId,
        containerId,
      },
    });

    return session;
  }

  async endSession(sessionId: number): Promise<void> {
    const session = await this.prismaService.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found with id: ' + sessionId);
    }

    await this.containersService.stop(session.containerId);
    await this.prismaService.session.update({
      where: { id: sessionId },
      data: { status: SessionStatus.TERMINATED },
    });
  }

  async expireSessions(): Promise<void> {
    // This method will be called by a cron job to mark sessions as expired after 30 mins of inactivity.
    const expiredSessions: Session[] =
      await this.prismaService.session.findMany({
        where: {
          status: SessionStatus.ACTIVE,
          lastActivityAt: {
            lt: new Date(Date.now() - 30 * 60 * 1000), // sessions inactive for more than 30 mins
          },
        },
      });

    console.log(
      'Expiring sessions: ',
      expiredSessions.map((s) => s.id),
    );
    for (const session of expiredSessions) {
      await this.containersService.stop(session.containerId);
      await this.prismaService.session.update({
        where: { id: session.id },
        data: { status: SessionStatus.EXPIRED },
      });
    }
  }

  async updateLastActivity(sessionId: number): Promise<void> {
    await this.prismaService.session.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });
  }
}
