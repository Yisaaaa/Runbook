import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const passHash = await this.authService.hashPassword(
      createUserDto.password,
    );

    const { passwordHash, ...userSafe } = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: passHash,
      },
    });

    return {
      ...userSafe,
    };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(({ passwordHash, ...userSafe }) => userSafe);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
