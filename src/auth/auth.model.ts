import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class AuthModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  async getOwnerOne(connection: PoolConnection, loginDto: LoginDto) {
    try {
      this.sql = `select ownerpkey, ownerid, ownerpassword from owner where ownerid=?`;
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
}
