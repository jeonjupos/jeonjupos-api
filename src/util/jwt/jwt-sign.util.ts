import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration.interface';

@Injectable()
export class JwtSignUtil {
  private connection: PoolConnection;
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 토큰 발행
   * @param payload
   * @param ownerpkey
   */
  async sign(payload: object, ownerpkey: number): Promise<string> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<Configuration['jwt']>('jwt').secret,
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
