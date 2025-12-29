import {
  Body,
  Post,
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.validateUser(signInDto);
  }

  @Post('signup')
  async singUp(@Body() signUpDto: SignUpDto) {
    return this.authService.createUser(signUpDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() request: any) {
    const { passwordHash, ...rest } = (await this.usersService.findByEmail(
      request.user.email,
    ))!;

    return rest;
  }
}
