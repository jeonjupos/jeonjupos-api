import { Injectable } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { OrderModel } from '../order.model';

// 주문번호 조회 및 변경
@Injectable()
export class OrderCodeGeneratorService {
  constructor(private orderModel: OrderModel) {}

  /**
   * 주문번호 생성
   * @param connection
   * @param storepkey
   */
  async orderCodeGenerator(connection: PoolConnection, storepkey: number) {
    try {
      // 주문번호 조회
      const ordercode = await this.orderModel.getOrderCode(
        connection,
        storepkey,
      );
      if (ordercode.length === 0) {
        // 주문번호 설정 안된경우 default로 생성함
        await this.orderModel.createOrderCode(connection, storepkey);
        return 1;
      } else {
        if (ordercode[0].code >= ordercode[0].codemax) {
          // 주문번호 최소 변경
          await this.orderModel.modifyOrderCode(
            connection,
            storepkey,
            ordercode[0].codemin,
          );
          return ordercode[0].codemin;
        } else {
          // 주문번호 + 1 업데이트
          await this.orderModel.modifyOrderCode(
            connection,
            storepkey,
            ordercode[0].code + 1,
          );
          return ordercode[0].code + 1;
        }
      }
    } catch (err) {
      throw err;
    }
  }
}
