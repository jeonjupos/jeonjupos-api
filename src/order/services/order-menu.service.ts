import { Injectable } from '@nestjs/common';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderMenuDto } from '../dto/order.dto';

@Injectable()
export class OrderMenuService {
  private orderPrice = 0;
  private orderMenuList = [];
  constructor(private orderModel: OrderModel) {}

  orderPriceCalculation(orderMenu: any, menu: any) {
    if (orderMenu.cancelyn === true) {
      // 취소
      this.orderPrice -= menu[0].saleprice * orderMenu.count;
    } else {
      // 주문
      if (menu[0].stock === 0 || orderMenu.count > menu[0].stock) {
        const err = new Error(`${menu[0].menuname} 재고가 부족합니다.`);
        err.name = 'STOCK_ERR';
        throw err;
      }
      this.orderPrice += menu[0].saleprice * orderMenu.count;
    }
    return this.orderPrice;
  }

  orderMenuListPush(menu: any, orderNumTicketPkey: number, orderMenu: any) {
    this.orderMenuList.push([
      menu[0].menupkey,
      orderNumTicketPkey,
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
    return this.orderMenuList;
  }

  /**
   * 주문메뉴 조회
   * 재고 수량 변경
   * @param connection
   * @param orderNumTicketPkey
   * @param orderList
   */
  async getOrderMenu(
    connection: PoolConnection,
    orderNumTicketPkey: number,
    orderList: OrderMenuDto[],
  ) {
    try {
      // orderList에 들어간 메뉴 총 합계 금액 계산
      for (const orderMenu of orderList) {
        const menu = await this.orderModel.getMenu(connection, orderMenu);
        if (menu.length === 1) {
          this.orderPrice = this.orderPriceCalculation(orderMenu, menu);
          // 메뉴 재고 수정
          await this.orderModel.modifyMenuStock(
            connection,
            menu[0].menupkey,
            orderMenu.cancelyn === true ? +orderMenu.count : -orderMenu.count,
          );
          this.orderMenuList = this.orderMenuListPush(
            menu,
            orderNumTicketPkey,
            orderMenu,
          );
        } else {
          // 메뉴를 찾을 수 없음
          const err = new Error(`메뉴를 찾을 수 없습니다.`);
          err.name = 'MENU_NOT_FOUND';
          throw err;
        }
      }

      return { orderPrice: this.orderPrice, orderMenuList: this.orderMenuList };
    } catch (err) {
      throw err;
    }
  }
}
