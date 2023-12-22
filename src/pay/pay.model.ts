import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PayModel {
  constructor(private databaseService: DatabaseService) {}

  /**
   * 주문서 조회
   * @param connection
   * @param orderinfopkey
   */
  async getOrderInfo(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select orderinfopkey, spacepkey, orderprice from orderinfo where orderinfopkey=? and paysuccessyn=false;`,
      [orderinfopkey],
    );
  }

  /**
   * 결제정보 조회
   * @param connection
   * @param orderinfopkey
   */
  async getPayInfos(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from payinfo where orderinfopkey=? order by payinfopkey desc`,
      [orderinfopkey],
    );
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
    return await this.databaseService.dbQuery(
      connection,
      `insert into payinfo (orderinfopkey, regdate, paycompleteyn, cashpayprice, cardpayprice, afterpayprice, expectedrestprice, cancelyn, paytype, paystatus) values (?, now(), true, ?, ?, ?, ?, false, ?, ?);`,
      [
        orderinfopkey,
        cashpayprice,
        cardpayprice,
        afeterpayprice,
        expectedrestprice,
        paytype,
        paystatus,
      ],
    );
  }

  /**
   * 카드 결제정보 저장
   * @param connection
   * @param payinfopkey
   * @param cardpayprice
   */
  async insertCardPay(connection: PoolConnection, payinfopkey, cardpayprice) {
    return await this.databaseService.dbQuery(
      connection,
      `insert into cardpay (payinfopkey, cardpayprice) values (? ,?);`,
      [payinfopkey, cardpayprice],
    );
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
    return await this.databaseService.dbQuery(
      connection,
      `insert into cashpay (payinfopkey, cashpayprice) values (?, ?);`,
      [payinfopkey, cashpayprice],
    );
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
    return await this.databaseService.dbQuery(
      connection,
      `insert into afterpay (payinfopkey, postpaidgrouppkey, afterpayprice) values (?, 2, ?);`,
      [payinfopkey, afterpayprice],
    );
  }

  /**
   * 주문서 결제완료상태로 변경
   * @param connection
   * @param orderinfopkey
   */
  async modifyOrderinfo(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `update orderinfo set spacepkey=null, paysuccessyn=true where orderinfopkey=?;`,
      [orderinfopkey],
    );
  }

  /**
   * 테이블 식사완료 상태로 변경
   * @param connection
   * @param spacepkey
   */
  async modifySpace(connection: PoolConnection, spacepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `update space set eatingyn=false where spacepkey=?;`,
      [spacepkey],
    );
  }
}
