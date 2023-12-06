import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuCategoryModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  /**
   * 메뉴 카테고리 목록 조회
   * @param connection
   * @param getCategoryListDto
   */
  async getCategoryList(
    connection: PoolConnection,
    getCategoryListDto: GetCategoryListDto,
  ) {
    try {
      this.sql = `
        select categorypkey, categoryname from category where storepkey=? and useyn=true order by sort;
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
