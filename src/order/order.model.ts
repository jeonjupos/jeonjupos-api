import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { FirstOrderDto, OrderMenuDto } from './dto/order.dto';

@Injectable()
export class OrderModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  async getMenu(connection: PoolConnection, orderMenu: OrderMenuDto) {
    try {
      this.sql = `select saleprice from menu where menupkey=?`;
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

  async firstOrder(
    connection: PoolConnection,
    firstOrderDto: FirstOrderDto,
    orderPrice: number,
  ) {
    try {
      this.sql = `
        insert into orderinfo (spacepkey, storepkey, reserveyn, deliveryyn, deliveryaddress, reservedate, regdate, paysuccessyn, orderprice) values (?, ?, ?, ?, ?, ?, now(), ?, ?)
      `;
      this.params = [
        firstOrderDto.spacepkey,
        firstOrderDto.storepkey,
        firstOrderDto.reserveyn,
        firstOrderDto.deliveryyn,
        firstOrderDto.deliveryaddress,
        firstOrderDto.reservedate,
        false,
        orderPrice,
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
}
