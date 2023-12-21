import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuCategoryModel {
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
    return await this.databaseService.dbQuery(
      connection,
      `
        select categorypkey, categoryname from category where storepkey=? and useyn=true order by sort;
      `,
      [getCategoryListDto.storepkey],
    );
  }
}
