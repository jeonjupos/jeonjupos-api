import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class MenuModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  async getMenuList(
    connection: PoolConnection,
    getMenuListDto: GetMenuListDto,
  ) {
    try {
      this.sql = `
        select
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
