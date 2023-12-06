import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordBcryptUtil {
  /**
   * 비밀번호 암호화
   * @param password
   */
  async pwBcrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, 10); // 비밀번호 암호화
  }

  /**
   * 비밀번호 검증
   * @param plainPwd : string 평문
   * @param bcryptPwd : string 암호화된 문자열
   */
  async pwValid(plainPwd: string, bcryptPwd: string): Promise<boolean> {
    return await bcrypt.compare(plainPwd, bcryptPwd);
  }
}
