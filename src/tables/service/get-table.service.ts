import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { TablesModel } from "../tables.model";
import { GetTableDto } from "../dto/get-table.dto";

@Injectable()
export class GetTableService {
  private connection: PoolConnection;
  private orderInfo: any;
  private payInfoList: any[];
  private orderMenuList: any;
  constructor(
    private databaseService: DatabaseService,
    private tablesModel: TablesModel,
  ) {}

  async getOrderInfo(spacepkey: number) {
    const orderInfoSet = await this.tablesModel.getOrderInfo(this.connection, spacepkey);
    return orderInfoSet.length > 0 ? orderInfoSet[0] : null;
  }

  async getOrderMenuList() {
    const orderMenuList = await this.tablesModel.getOrderMenuList(
      this.connection,
      this.orderInfo.orderinfopkey,
    );

    return orderMenuList.filter((orderMenu) => orderMenu.count > 0);
  }

  /**
   * 테이블 상세 조회
   * @param getTableDto
   */
  async getTable(getTableDto: GetTableDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 주문서 정보 조회
      this.orderInfo = await this.getOrderInfo(getTableDto.spacepkey);
      if (this.orderInfo === null) return {
        orderinfo: {},
        payinfo: [],
        ordermenulist: [],
      };

      // 결제 정보 조회
      this.payInfoList = await this.tablesModel.getPayInfo(
        this.connection,
        this.orderInfo.orderinfopkey,
      );

      // 주문메뉴 목록 조회
      this.orderMenuList = await this.getOrderMenuList()

      return {
        orderinfo: this.orderInfo,
        payinfo: this.payInfoList,
        ordermenulist: this.orderMenuList,
      };
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
