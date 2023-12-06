import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  /**
   * 카테고리별 메뉴 목록 조회
   * @param connection
   * @param getMenuListDto
   */
  async getMenuList(
    connection: PoolConnection,
    getMenuListDto: GetMenuListDto,
  ) {
    try {
      this.sql = `
        select
            menupkey,
            menuname, originprice, discountyn, 
            discountrate, saleprice, stock, 
            takeoutyn, takeinyn, takeoutprice  
        from menu where categorypkey=? and useyn=true order by sort
      `;
      this.params = [getMenuListDto.categorypkey];
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
