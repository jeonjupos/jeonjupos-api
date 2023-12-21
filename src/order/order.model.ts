import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { OrderDto, OrderMenuDto } from './dto/order.dto';

@Injectable()
export class OrderModel {
  constructor(private databaseService: DatabaseService) {}

  /**
   * 테이블 조회
   * @param connection
   * @param spacepkey
   */
  async getSpace(connection: PoolConnection, spacepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from space where spacepkey=?;`,
      [spacepkey],
    );
  }

  /**
   * 테이블 식사중으로 변경
   * @param connection
   * @param spacepkey
   */
  async modifySpaceEating(connection: PoolConnection, spacepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `update space set eatingyn=true where spacepkey=?`,
      [spacepkey],
    );
  }

  /**
   * 메뉴 조회
   * @param connection
   * @param orderMenu
   */
  async getMenu(connection: PoolConnection, orderMenu: OrderMenuDto) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from menu where menupkey=? for update`,
      [orderMenu.menupkey],
    );
  }

  /**
   * 메뉴 재고 수정
   * @param connection
   * @param menupkey
   * @param count
   */
  async modifyMenuStock(
    connection: PoolConnection,
    menupkey: number,
    count: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update menu set stock=stock+? where menupkey=? and dailystock > stock+?`,
      [count, menupkey, count],
    );
  }

  /**
   * 주문서 생성
   * @param connection
   * @param orderDto
   */
  async createOrderInfo(connection: PoolConnection, orderDto: OrderDto) {
    return await this.databaseService.dbQuery(
      connection,
      `insert into orderinfo (spacepkey, storepkey, reserveyn, deliveryyn, deliveryaddress, reservedate, regdate, paysuccessyn, orderprice) values (?, ?, ?, ?, ?, ?, now(), ?, ?)`,
      [
        orderDto.spacepkey,
        orderDto.storepkey,
        orderDto.reserveyn,
        orderDto.deliveryyn,
        orderDto.deliveryaddress,
        orderDto.reservedate,
        false,
        0,
      ],
    );
  }

  /**
   * 주문번호 조회
   * @param connection
   * @param storepkey
   */
  async getOrderCode(connection: PoolConnection, storepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from ordercode where storepkey=?;`,
      [storepkey],
    );
  }

  /**
   * 주문번호 생성
   * @param connection
   * @param storepkey
   */
  async createOrderCode(connection: PoolConnection, storepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `insert into ordercode (storepkey, codemin, codemax, code) values (?, 1, 500, 1);`,
      [storepkey],
    );
  }

  /**
   * 주문번호 수정
   * @param connection
   * @param storepkey
   * @param code
   */
  async modifyOrderCode(
    connection: PoolConnection,
    storepkey: number,
    code: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update ordercode set code=? where storepkey=?;`,
      [code, storepkey],
    );
  }

  /**
   * 번호표 생성
   * @param connection
   * @param orderinfopkey
   * @param ordernum
   */
  async createOrderNumTicket(
    connection: PoolConnection,
    orderinfopkey: number,
    ordernum: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `insert into ordernumticket (orderinfopkey, ordernum) values (?, ?)`,
      [orderinfopkey, ordernum],
    );
  }

  /**
   * 주문메뉴 저장
   * @param connection
   * @param orderMenuList
   */
  async createOrderMenu(
    connection: PoolConnection,
    orderMenuList: OrderMenuDto[],
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `insert into ordermenu (menupkey, ordernumticketpkey, menuname, originprice, discountyn, discountrate, saleprice, stock, useyn, sort, takeoutyn, takeinyn, takeoutprice, count, additionaldiscount, cancelyn) values ?`,
      [orderMenuList],
    );
  }

  /**
   * 주문서 주문금액 수정
   * @param connection
   * @param orderinfopkey
   * @param orderprice
   */
  async modifyOrderInfoOrderPrice(
    connection: PoolConnection,
    orderinfopkey: number,
    orderprice: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        update orderinfo set orderprice=orderprice+? where orderinfopkey=?;
      `,
      [orderprice, orderinfopkey],
    );
  }
}
