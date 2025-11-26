import { User } from 'src/generated/prisma/client';

export type UserResponseDto = Omit<User, 'passwordHash'>;
