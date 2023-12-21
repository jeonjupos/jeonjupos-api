import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { PayModel } from "../pay.model";

@Injectable()
export class GetPayInfoListService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private payModel: PayModel,
  ) {}

  /**
   * 결제정보 조회
   * @param orderinfopkey
   */
  async getPayInfoList(orderinfopkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      return await this.payModel.getPayInfos(this.connection, orderinfopkey);
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
