import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PayModel } from './pay.model';
import { PoolConnection } from 'mysql2/promise';
import { PayDto } from './dto/pay.dto';

@Injectable()
export class PayService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private payModel: PayModel,
  ) {}

  /**
   * 주문서 정보 조회
   * @param orderinfopkey
   */
  async getOrderInfo(orderinfopkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const orderinfo = await this.payModel.getOrderInfo(
        this.connection,
        orderinfopkey,
      );
      if (orderinfo.length === 0) {
        return null;
      } else {
        return orderinfo[0];
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 결제 상태, 결제후 남은금액 계산
   * @param restpayprice
   * @param payprice
   */
  payInfoStatus(
    restpayprice,
    payprice: number,
  ): { paystatus: string; expectedrestprice: number } {
    const paystatus = restpayprice === payprice ? 'complete' : 'partpay';
    const expectedrestprice = restpayprice - payprice;
    return { paystatus: paystatus, expectedrestprice: expectedrestprice };
  }

  async getPayInfos(orderinfopkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      return await this.payModel.getPayInfos(this.connection, orderinfopkey);
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 현금결제
   * @param payDto
   * @param orderinfo
   * @param restpayprice
   */
  async cashPay(payDto: PayDto, orderinfo: object, restpayprice: number) {
    try {
      // 결제상태, 결제후 남은금액 조회
      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      // 결제정보 생성
      const payinfo = await this.payModel.insertPayInfo(
        this.connection,
        payDto.orderinfopkey,
        payDto.payprice,
        0,
        0,
        expectedrestprice,
        'cash',
        paystatus,
      );

      // 현금결제정보 생성
      await this.payModel.insertCashPay(
        this.connection,
        payinfo.insertId,
        payDto.payprice,
      );

      await this.connection.commit();
      return { result: true, message: '성공' };
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
    } finally {
      this.connection.release();
    }
  }

  /**
   * 카드결제
   * @param payDto
   * @param orderinfo
   * @param restpayprice
   */
  async cardPay(payDto: PayDto, orderinfo: object, restpayprice: number) {
    try {
      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const payinfo = await this.payModel.insertPayInfo(
        this.connection,
        payDto.orderinfopkey,
        0,
        payDto.payprice,
        0,
        expectedrestprice,
        payDto.paytype,
        paystatus,
      );
      await this.payModel.insertCardPay(
        this.connection,
        payinfo.insertId,
        payDto.payprice,
      );

      await this.connection.commit();
      return { result: true, message: '성공' };
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
    } finally {
      this.connection.release();
    }
  }

  /**
   * 후불결제
   * @param payDto
   * @param orderinfo
   * @param restpayprice
   */
  async afterPay(payDto: PayDto, orderinfo: object, restpayprice: number) {
    try {
      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const payinfo = await this.payModel.insertPayInfo(
        this.connection,
        payDto.orderinfopkey,
        0,
        0,
        payDto.payprice,
        expectedrestprice,
        payDto.paytype,
        paystatus,
      );
      await this.payModel.insertAfterPay(
        this.connection,
        payinfo.insertId,
        payDto.payprice,
      );

      await this.connection.commit();
      return { result: true, message: '성공' };
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
    } finally {
      this.connection.release();
    }
  }

  /**
   * 결제 완료 후 주문서 결제 상태, 테이블 식사여부 변경
   * @param orderinfo
   */
  async payCompleteModify(orderinfo) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      // 주문서 정보 결제완료로 변경
      await this.payModel.modifyOrderinfo(
        this.connection,
        orderinfo.orderinfopkey,
      );

      // 테이블 식사여 변경
      await this.payModel.modifySpace(this.connection, orderinfo.spacepkey);

      await this.connection.commit();
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
    } finally {
      this.connection.release();
    }
  }
}
