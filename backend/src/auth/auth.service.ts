import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bycrypt from 'bcrypt';
import { Prisma } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { User } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<any> {
    const user: Prisma.UserModel | null = await this.userService.findByEmail(
      signInDto.email,
    );

    const isPasswordMatch: boolean = user
      ? await bycrypt.compare(signInDto.password, user.passwordHash)
      : false;
    if (!isPasswordMatch) {
    }

    if (!user || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async createUser(signUpDto: SignUpDto): Promise<any> {
    const user: User | null = await this.userService.findByEmail(
      signUpDto.email,
    );

    console.log(user);
    if (user !== null) {
      throw new BadRequestException('User already exists');
    }

    const newUser: UserResponseDto = await this.userService.create(signUpDto);

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
