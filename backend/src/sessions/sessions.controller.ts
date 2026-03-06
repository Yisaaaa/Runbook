import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
  // This controller will handle API endpoints related to session management, such as creating a new session, fetching active sessions, and ending sessions.

  constructor(private readonly sessionsService: SessionsService) {}

  @Post('create')
  async createSession(@Body() data: CreateSessionDto) {
    return this.sessionsService.createSession(data);
  }

  @Delete('end/:id')
  async endSession(@Param('id') id: number) {
    return this.sessionsService.endSession(id);
  }

  @Get('active/:userId/:runbookId')
  async getActiveSession(
    @Param('userId') userId: number,
    @Param('runbookId') runbookId: number,
  ) {
    return this.sessionsService.getActiveSession(userId, runbookId);
  }
}
