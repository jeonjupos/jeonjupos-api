import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { AuthModel } from './auth.model';
import { PasswordBcryptUtil } from '../util/password/password-bcrypt.util';

@Injectable()
export class AuthLoginService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private authModel: AuthModel,
    private passwordBcryptUtil: PasswordBcryptUtil,
  ) {}

  /**
   * 로그인
   * 점주 조회 및 비밀번호 일치여부 체크
   * @param loginDto
   */
  async login(loginDto: LoginDto): Promise<{
    ownerpkey: number;
    ownerid: string;
    ownerpassword: string;
    storename: string;
    storepkey: number;
  }> {
    try {
      this.connection = await this.databaseService.getDBConnection();

      // 회원 조회
      const owner = await this.authModel.getOwnerOne(this.connection, loginDto);
      if (owner.length !== 1) {
        return null;
      } else {
        // 비밀번호 검증
        const pwdValid = await this.passwordBcryptUtil.pwValid(
          loginDto.ownerpassword,
          owner[0].ownerpassword,
        );
        if (pwdValid === false) {
          throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        // 응답
        return owner[0];
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 토큰으로 회원 조회
   * @param token
   */
  async getOwner(token: string) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const owner = await this.authModel.getOwnerToken(this.connection, token);
      if (owner.length !== 1) {
        return null;
      } else {
        return owner[0];
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
