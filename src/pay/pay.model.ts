import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PayModel {
  private sql: string;
  private params: any[];
  constructor(private databaseService: DatabaseService) {}

  /**
   * 주문서 조회
   * @param connection
   * @param orderinfopkey
   */
  async getOrderInfo(connection: PoolConnection, orderinfopkey: number) {
    try {
      this.sql = `
        select orderinfopkey, spacepkey, orderprice from orderinfo where orderinfopkey=? and paysuccessyn=false;
      `;
      this.params = [orderinfopkey];
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
   * 결제정보 조회
   * @param connection
   * @param orderinfopkey
   */
  async getPayInfos(connection: PoolConnection, orderinfopkey: number) {
    try {
      this.sql = `select * from payinfo where orderinfopkey=? order by payinfopkey desc`;
      this.params = [orderinfopkey];
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
   * 결제정보 저장
   * @param connection
   * @param orderinfopkey
   * @param cashpayprice
   * @param cardpayprice
   * @param afeterpayprice
   * @param expectedrestprice
   * @param paytype
   * @param paystatus
   */
  async insertPayInfo(
    connection: PoolConnection,
    orderinfopkey,
    cashpayprice,
    cardpayprice,
    afeterpayprice,
    expectedrestprice,
    paytype,
    paystatus,
  ) {
    try {
      this.sql = `
        insert into payinfo (orderinfopkey, regdate, paycompleteyn, cashpayprice, cardpayprice, afterpayprice, expectedrestprice, cancelyn, paytype, paystatus) values (?, now(), true, ?, ?, ?, ?, false, ?, ?);
      `;
      this.params = [
        orderinfopkey,
        cashpayprice,
        cardpayprice,
        afeterpayprice,
        expectedrestprice,
        paytype,
        paystatus,
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
   * 카드 결제정보 저장
   * @param connection
   * @param payinfopkey
   * @param cardpayprice
   */
  async insertCardPay(connection: PoolConnection, payinfopkey, cardpayprice) {
    try {
      this.sql = `
        insert into cardpay (payinfopkey, cardpayprice) values (? ,?);
      `;
      this.params = [payinfopkey, cardpayprice];
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
   * 현금 결제정보 저장
   * @param connection
   * @param payinfopkey
   * @param cashpayprice
   */
  async insertCashPay(
    connection: PoolConnection,
    payinfopkey: number,
    cashpayprice: number,
  ) {
    try {
      this.sql = `
        insert into cashpay (payinfopkey, cashpayprice) values (?, ?);
      `;
      this.params = [payinfopkey, cashpayprice];
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
   * 후불결제 정보 저장
   * @param connection
   * @param payinfopkey
   * @param afterpayprice
   */
  async insertAfterPay(
    connection: PoolConnection,
    payinfopkey: number,
    afterpayprice: number,
  ) {
    try {
      this.sql = `
        insert into afterpay (payinfopkey, postpaidgrouppkey, afterpayprice) values (?, 2, ?);
      `;
      this.params = [payinfopkey, afterpayprice];
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
   * 주문서 결제완료상태로 변경
   * @param connection
   * @param orderinfopkey
   */
  async modifyOrderinfo(connection: PoolConnection, orderinfopkey: number) {
    try {
      this.sql = `update orderinfo set spacepkey=null, paysuccessyn=true where orderinfopkey=?;`;
      this.params = [orderinfopkey];
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
   * 테이블 식사완료 상태로 변경
   * @param connection
   * @param spacepkey
   */
  async modifySpace(connection: PoolConnection, spacepkey: number) {
    try {
      this.sql = `update space set eatingyn=false where spacepkey=?;`;
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
}
