import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';
import { DatabaseService } from '../../database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class JwtSignUtil {
  private connection: PoolConnection;
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async sign(payload: object, ownerpkey: number): Promise<string> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const token = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
      });

      // 점주 token 수정
      await this.databaseService.dbQuery(
        this.connection,
        `update owner set token=? where ownerpkey=?`,
        [token, ownerpkey],
      );

      return token;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
