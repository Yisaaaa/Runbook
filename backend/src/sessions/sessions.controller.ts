import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import type { JwtPayload } from 'src/auth/auth.types';

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

  @UseGuards(AuthGuard)
  @Post('connect/:runbookId')
  async connectToSession(
    @Param('runbookId') runbookId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sessionsService.connectToSession(user.sub, runbookId);
  }
}
