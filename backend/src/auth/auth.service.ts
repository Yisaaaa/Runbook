import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bycrypt from 'bcrypt';
import { Prisma } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(signInDto: SignInDto): Promise<any> {
    const user: Prisma.UserModel | null = await this.userService.findByEmail(
      signInDto.email,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch: boolean = await bycrypt.compare(
      signInDto.password,
      user.passwordHash,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...userSafe } = user;
    return userSafe;
  }
}
