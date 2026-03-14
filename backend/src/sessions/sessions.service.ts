import { GoneException, Injectable } from '@nestjs/common';
import { ContainersService } from 'src/containers/containers.service';
import { Session, SessionStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RunbooksService } from 'src/runbooks/runbooks.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly containersService: ContainersService,
    private readonly runbooksService: RunbooksService,
  ) {}

  async connectToSession(userId: number, runbookId: number): Promise<Session> {
    // will get an active session or create a new one
    const activeSession = await this.getActiveSession(userId, runbookId);

    if (activeSession) {
      const isContainerAlive = await this.containersService.isContainerAlive(
        activeSession.containerId,
      );
      if (!isContainerAlive) {
        // mark EXPIRED and fall back through createSession
        await this.prismaService.session.update({
          where: { id: activeSession.id },
          data: { status: SessionStatus.EXPIRED },
        });
      } else {
        return activeSession;
      }
    }

    return await this.createSession({ userId, runbookId });
  }

  async getActiveSession(
    userId: number,
    runbookId: number,
  ): Promise<Session | null> {
    const activeSession = await this.prismaService.session.findFirst({
      where: {
        status: SessionStatus.ACTIVE,
        lastActivityAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // sessions active in the last 30 mins
        },
        userId,
        runbookId,
      },
    });
    return activeSession;
  }

  async getSessionById(sessionId: number): Promise<Session | null> {
    const session = await this.prismaService.session.findUnique({
      where: { id: sessionId, status: SessionStatus.ACTIVE },
    });

    if (!session) return null;

    const containerAlive = await this.containersService.isContainerAlive(
      session.containerId,
    );

    if (!containerAlive)
      throw new GoneException(
        'Session container is no longer alive. Please reconnect',
      );

    return session;
  }

  async createSession(data: CreateSessionDto): Promise<Session> {
    const containerId: string = await this.containersService.createContainer();

    try {
      // Seed fileblocks
      const fileBlocks = await this.runbooksService.getRunbookFileBlocks(
        data.runbookId,
      );

      await Promise.all(
        fileBlocks.map(async (fileBlock) => {
          await this.containersService.putCodeToFile(
            fileBlock.code,
            containerId,
            fileBlock.filename,
          );
        }),
      );

      const session = await this.prismaService.session.create({
        data: {
          userId: data.userId,
          runbookId: data.runbookId,
          containerId,
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating session: ', error);
      this.containersService.remove(containerId);
      throw error;
    }
  }

  async endSession(sessionId: number): Promise<void> {
    const session = await this.prismaService.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found with id: ' + sessionId);
    }

    await this.containersService.stop(session.containerId);
    await this.containersService.remove(session.containerId);
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

    const results = await Promise.allSettled(
      expiredSessions.map(async (session) => {
        await this.containersService.stop(session.containerId);
        await this.containersService.remove(session.containerId);
        await this.prismaService.session.update({
          where: { id: session.id },
          data: { status: SessionStatus.EXPIRED },
        });
      }),
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Failed to expire session: ', result.reason);
      }
    }
  }

  async updateLastActivity(sessionId: number): Promise<void> {
    await this.prismaService.session.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });
  }
}
