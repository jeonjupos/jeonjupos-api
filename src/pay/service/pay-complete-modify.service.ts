import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { PayModel } from "../pay.model";

@Injectable()
export class PayCompleteModifyService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private payModel: PayModel,
  ) {}

  /**
   * 결제 완료 후 주문서 결제 상태, 테이블 식사여부 변경
   * @param orderinfo
   */
  async payCompleteModify(orderinfo: any) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      // 주문서 정보 결제완료로 변경
      await this.payModel.modifyOrderinfo(
        this.connection,
        orderinfo.orderinfopkey,
      );

      // 테이블 식사여 변경
      await this.payModel.modifySpace(this.connection, orderinfo.spacepkey);

      await this.connection.commit();
      return true;
    } catch (err) {
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
