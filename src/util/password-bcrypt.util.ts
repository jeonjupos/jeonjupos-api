import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordBcryptUtil {
  async pwBcrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, 10); // 비밀번호 암호화
  }

  async pwValid(plainPwd: string, bcryptPwd: string): Promise<boolean> {
    return await bcrypt.compare(plainPwd, bcryptPwd);
  }
}
