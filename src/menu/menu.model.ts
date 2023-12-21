import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuModel {
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
    return await this.databaseService.dbQuery(
      connection,
      `
          select
            menupkey,
            menuname, originprice, discountyn, 
            discountrate, saleprice, stock, 
            takeoutyn, takeinyn, takeoutprice  
          from menu where categorypkey=? and useyn=true order by sort
        `,
      [getMenuListDto.categorypkey],
    );
  }
}
