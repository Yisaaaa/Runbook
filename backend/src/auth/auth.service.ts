import { Injectable } from '@nestjs/common';
import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await bycrypt.hash(password, 10);
  }
}
