import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuCategoryModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  async getCategoryList(
    connection: PoolConnection,
    getCategoryListDto: GetCategoryListDto,
  ) {
    try {
      this.sql = `
        select categorypkey, categoryname from category where storepkey=? and useyn=true;
      `;
      this.params = [getCategoryListDto.storepkey];
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
