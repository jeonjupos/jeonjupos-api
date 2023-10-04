import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderMenuDto } from '../dto/order.dto';

/**
 * 주문서 총 판매금액 조회
 */
@Injectable()
export class OrderPriceCalculationService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
  ) {}

  async getOrderTotalPrice(orderList: OrderMenuDto[]): Promise<number> {
    try {
      let orderPrice = 0;
      this.connection = await this.databaseService.getDBConnection();
      // orderList에 들어간 메뉴 총 합계 금액 계산
      for (const orderMenu of orderList) {
        const menu = await this.orderModel.getMenu(this.connection, orderMenu);
        if (menu.length === 1) {
          orderPrice += menu[0].saleprice * orderMenu.count;
        }
      }

      return orderPrice;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
