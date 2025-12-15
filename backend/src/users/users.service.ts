import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dtos/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import * as bycrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return await bycrypt.hash(password, 10);
  }

  async create(createUserDto: SignUpDto): Promise<UserResponseDto> {
    const data: Prisma.UserCreateInput = {
      username: createUserDto.name,
      email: createUserDto.email,
      passwordHash: await this.hashPassword(createUserDto.password),
    };

    const user = await this.prismaService.user.create({ data });
    const { passwordHash, ...userSafe } = user;
    return userSafe;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
