import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class AuthModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  /**
   * 관리자 조회
   * @param connection
   * @param loginDto
   */
  async getOwnerOne(connection: PoolConnection, loginDto: LoginDto) {
    try {
      this.sql = `
        select owner.ownerpkey, ownerid, ownerpassword, storename, storepkey
        from owner 
        join store on owner.ownerpkey=store.ownerpkey
        where ownerid=?`;
      this.params = [loginDto.ownerid];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 토큰으로 회원 조회
   * @param connection
   * @param token
   */
  async getOwnerToken(connection: PoolConnection, token: string) {
    try {
      this.sql = `
        select owner.ownerpkey, ownerid, ownerpassword, storename, storepkey
        from owner 
        join store on owner.ownerpkey=store.ownerpkey
        where token=?;
      `;
      this.params = [token];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }
}
