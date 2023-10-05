import { Injectable } from '@nestjs/common';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderMenuDto } from '../dto/order.dto';

@Injectable()
export class OrderMenuService {
  constructor(private orderModel: OrderModel) {}

  /**
   * 주문메뉴 조회
   * @param connection
   * @param ordernumticketpkey
   * @param orderList
   */
  async getOrderMenu(
    connection: PoolConnection,
    ordernumticketpkey: number,
    orderList: OrderMenuDto[],
  ) {
    try {
      let orderPrice = 0;
      const orderMenuList = [];
      // orderList에 들어간 메뉴 총 합계 금액 계산
      for (const orderMenu of orderList) {
        const menu = await this.orderModel.getMenu(connection, orderMenu);
        if (menu.length === 1) {
          // 메뉴 재고 수정
          await this.orderModel.modifyMenuStock(
            connection,
            menu[0].menupkey,
            orderMenu.cancelyn === true ? -orderMenu.count : +orderMenu.count,
          );
          if (orderMenu.cancelyn === true) {
            // 취소
            orderPrice = orderPrice - menu[0].saleprice * orderMenu.count;
          } else {
            // 주문
            orderPrice += menu[0].saleprice * orderMenu.count;
          }
          orderMenuList.push([
            menu[0].menupkey,
            ordernumticketpkey,
            menu[0].menuname,
            menu[0].originprice,
            menu[0].discountyn,
            menu[0].discountrate,
            menu[0].saleprice,
            menu[0].stock,
            menu[0].useyn,
            menu[0].sort,
            menu[0].takeoutyn,
            menu[0].takeinyn,
            menu[0].takeoutprice,
            orderMenu.count,
            0,
            orderMenu.cancelyn,
          ]);
        }
      }

      return { orderPrice: orderPrice, orderMenuList: orderMenuList };
    } catch (err) {
      throw err;
    }
  }
}
