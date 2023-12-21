import { Injectable } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { OrderModel } from '../order.model';

// 주문번호 조회 및 변경
@Injectable()
export class OrderCodeGeneratorService {
  private code: number;
  constructor(private orderModel: OrderModel) {}

  /**
   * 주문번호 생성
   * @param connection
   * @param storepkey
   */
  async orderCodeGenerator(
    connection: PoolConnection,
    storepkey: number,
  ): Promise<number> {
    try {
      // 주문번호 조회
      const orderCodeSet = await this.orderModel.getOrderCode(
        connection,
        storepkey,
      );
      if (orderCodeSet.length === 0) {
        // 주문번호 설정 안된경우 default로 생성함
        await this.orderModel.createOrderCode(connection, storepkey);
        return 1;
      } else {
        const coderCode = orderCodeSet[0];
        if (coderCode.code >= coderCode.codemax) {
          // 주문번호 리셋
          this.code = coderCode.codemin;
        } else {
          // 주문번호 + 1 업데이트
          this.code = coderCode.code + 1;
        }
        await this.orderModel.modifyOrderCode(connection, storepkey, this.code);
        return this.code;
      }
    } catch (err) {
      throw err;
    }
  }
}
