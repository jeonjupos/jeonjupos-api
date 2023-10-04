import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { OrderModel } from '../order.model';

@Injectable()
export class OrderCodeGeneratorService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
  ) {}

  async orderCodeGenerator(storepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 주문번호 조회
      const ordercode = await this.orderModel.getOrderCode(
        this.connection,
        storepkey,
      );
      if (ordercode.length === 0) {
        // 주문번호 설정 안된경우 default로 생성함
        await this.orderModel.createOrderCode(this.connection, storepkey);
        return 1;
      } else {
        if (ordercode[0].code >= ordercode[0].codemax) {
          // 주문번호 최소 변경
          await this.orderModel.modifyOrderCode(
            this.connection,
            storepkey,
            ordercode[0].codemin,
          );
          return ordercode[0].codemin;
        } else {
          // 주문번호 + 1 업데이트
          await this.orderModel.modifyOrderCode(
            this.connection,
            storepkey,
            ordercode[0].code + 1,
          );
          return ordercode[0].code + 1;
        }
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
