import { Injectable } from "@nestjs/common";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "../../database/database.service";
import { OrderModel } from "../order.model";

@Injectable()
export class GetSpaceValidService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
  ) {}

  /**
   * 테이블 유효성 체크를 위한 조회
   * @param spacepkey
   */
  async getSpaceValid(spacepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const spaceSet = await this.orderModel.getSpace(
        this.connection,
        spacepkey,
      );
      if (spaceSet.length === 0) {
        return { resCode: '0008', space: null };
      } else {
        const space = spaceSet[0];
        if (space.isactiveyn === false) {
          // 비활성화된 테이블
          return { resCode: '0009', space: space };
        } else {
          return { resCode: '0000', space: space };
        }
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
