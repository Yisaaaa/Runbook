import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters long' })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50, { message: 'Password must be at least 8 characters long' })
  password: string;
}
