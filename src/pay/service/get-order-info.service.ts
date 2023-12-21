import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { PayModel } from "../pay.model";

@Injectable()
export class GetOrderInfoService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private payModel: PayModel,
  ) {}

  /**
   * 주문서 정보 조회
   * @param orderinfopkey
   */
  async getOrderInfo(orderinfopkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const orderinfoSet = await this.payModel.getOrderInfo(
        this.connection,
        orderinfopkey,
      );
      if (orderinfoSet.length === 0) {
        return null;
      } else {
        return orderinfoSet[0];
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
