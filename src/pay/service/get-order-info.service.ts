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
      const orderInfoSet = await this.payModel.getOrderInfo(
        this.connection,
        orderinfopkey,
      );
      return orderInfoSet.length === 0 ? null : orderInfoSet[0];
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
