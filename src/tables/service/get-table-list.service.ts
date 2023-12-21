import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { TablesModel } from "../tables.model";
import { GetTablesDto } from "../dto/get-tables.dto";

@Injectable()
export class GetTableListService {
  private connection: PoolConnection;
  private tableSet: any[];
  constructor(
    private databaseService: DatabaseService,
    private tablesModel: TablesModel,
  ) {}

  async getTableOrderList(): Promise<any[]> {
    return this.tableSet.map(async (table: { spacepkey: number; }) => {
      const tableOrderList = await this.tablesModel.getTablesOrderList(this.connection, table.spacepkey);
      return tableOrderList.filter((tableOrder: { count: number; }) => {tableOrder.count > 0;});
    });
  }

  /**
   * 테이블 목록 조회
   * @param getTablesDto
   */
  async getTableList(getTablesDto: GetTablesDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      this.tableSet = await this.tablesModel.getTableList(
        this.connection,
        getTablesDto,
      );
      return await Promise.all([await this.getTableOrderList()]);
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
