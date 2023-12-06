import { Injectable } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service';
import { TablesModel } from './tables.model';
import { GetTablesDto } from './dto/get-tables.dto';
import { GetTableDto } from './dto/get-table.dto';

@Injectable()
export class TablesService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private tablesModel: TablesModel,
  ) {}

  /**
   * 테이블 목록 조회
   * @param getTablesDto
   */
  async getTableList(getTablesDto: GetTablesDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const tables = await this.tablesModel.getTableList(
        this.connection,
        getTablesDto,
      );
      for (const table of tables) {
        // 테이블별 마지막 주문 5개만 불러오기
        const talbeorderlist = await this.tablesModel.getTablesOrderList(
          this.connection,
          table.spacepkey,
        );

        table.talbeorderlist = talbeorderlist.filter(
          (tableorder) => tableorder.count > 0,
        );
      }
      return tables;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 테이블 상세 조회
   * @param getTableDto
   */
  async getTable(getTableDto: GetTableDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 주문서 정보 조회
      const orderinfo = await this.tablesModel.getOrderInfo(
        this.connection,
        getTableDto,
      );
      if (orderinfo.length === 0) {
        return {
          orderinfo: {},
          payinfo: [],
          ordermenulist: [],
        };
      }

      // 결제 정보 조회
      const payinfos = await this.tablesModel.getPayInfo(
        this.connection,
        orderinfo[0].orderinfopkey,
      );

      // 주문메뉴 목록 조회
      const ordermenulist = await this.tablesModel.getOrderMenuList(
        this.connection,
        orderinfo[0].orderinfopkey,
      );

      const newOrdermenulist = ordermenulist.filter(
        (ordermenu) => ordermenu.count > 0,
      );

      return {
        orderinfo: orderinfo[0],
        payinfo: payinfos.length > 0 ? payinfos : [],
        ordermenulist: newOrdermenulist,
      };
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
