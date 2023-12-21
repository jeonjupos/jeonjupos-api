import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { TablesModel } from "../tables.model";
import { GetTablesDto } from "../dto/get-tables.dto";

@Injectable()
export class GetTableListService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private tablesModel: TablesModel,
  ) {}

  async getTableOrderList(connection: PoolConnection, spacepkey: number): Promise<any[]> {
    const tableOrderList = await this.tablesModel.getTablesOrderList(connection, spacepkey);
    return tableOrderList.filter((tableOrder: { count: number; }) => {tableOrder.count > 0;});
  }

  /**
   * 테이블 목록 조회
   * @param getTablesDto
   */
  async getTableList(getTablesDto: GetTablesDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const tableSet = await this.tablesModel.getTableList(
        this.connection,
        getTablesDto,
      );
      return await Promise.all(
        tableSet.map(async (table: { spacepkey: number; }) => {
          await this.getTableOrderList(this.connection, table.spacepkey);
        })
      )
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
