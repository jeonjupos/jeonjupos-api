import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { OrderDto, OrderMenuDto } from './dto/order.dto';

@Injectable()
export class OrderModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  /**
   * 테이블 조회
   * @param connection
   * @param spacepkey
   */
  async getSpace(connection: PoolConnection, spacepkey: number) {
    try {
      this.sql = `select * from space where spacepkey=?;`;
      this.params = [spacepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 테이블 식사중으로 변경
   * @param connection
   * @param spacepkey
   */
  async modifySpaceEating(connection: PoolConnection, spacepkey: number) {
    try {
      this.sql = `update space set eatingyn=true where spacepkey=?`;
      this.params = [spacepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 메뉴 조회
   * @param connection
   * @param orderMenu
   */
  async getMenu(connection: PoolConnection, orderMenu: OrderMenuDto) {
    try {
      this.sql = `select * from menu where menupkey=? for update`;
      this.params = [orderMenu.menupkey];
      return await await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
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
    try {
      this.sql = `update menu set stock=stock+? where menupkey=? and dailystock > stock+?`;
      this.params = [count, menupkey, count];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문서 생성
   * @param connection
   * @param orderDto
   */
  async createOrderInfo(connection: PoolConnection, orderDto: OrderDto) {
    try {
      this.sql = `
        insert into orderinfo (spacepkey, storepkey, reserveyn, deliveryyn, deliveryaddress, reservedate, regdate, paysuccessyn, orderprice) values (?, ?, ?, ?, ?, ?, now(), ?, ?)
      `;
      this.params = [
        orderDto.spacepkey,
        orderDto.storepkey,
        orderDto.reserveyn,
        orderDto.deliveryyn,
        orderDto.deliveryaddress,
        orderDto.reservedate,
        false,
        0,
      ];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문번호 조회
   * @param connection
   * @param storepkey
   */
  async getOrderCode(connection: PoolConnection, storepkey: number) {
    try {
      this.sql = `select * from ordercode where storepkey=?;`;
      this.params = [storepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문번호 생성
   * @param connection
   * @param storepkey
   */
  async createOrderCode(connection: PoolConnection, storepkey: number) {
    try {
      this.sql = `insert into ordercode (storepkey, codemin, codemax, code) values (?, 1, 500, 1);`;
      this.params = [storepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
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
    try {
      this.sql = `update ordercode set code=? where storepkey=?;`;
      this.params = [code, storepkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
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
    try {
      this.sql = `insert into ordernumticket (orderinfopkey, ordernum) values (?, ?)`;
      this.params = [orderinfopkey, ordernum];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
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
    try {
      this.sql = `insert into ordermenu (menupkey, ordernumticketpkey, menuname, originprice, discountyn, discountrate, saleprice, stock, useyn, sort, takeoutyn, takeinyn, takeoutprice, count, additionaldiscount, cancelyn) values ?`;
      this.params = [orderMenuList];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
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
    try {
      this.sql = `
        update orderinfo set orderprice=orderprice+? where orderinfopkey=?;
      `;
      this.params = [orderprice, orderinfopkey];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }
}
