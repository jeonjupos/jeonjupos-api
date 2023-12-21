import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PayModel } from '../pay.model';
import { PoolConnection } from 'mysql2/promise';
import { PayDto } from '../dto/pay.dto';

@Injectable()
export class PayService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private payModel: PayModel,
  ) {}

  /**
   * 결제 상태, 결제후 남은금액 계산
   * @param restpayprice
   * @param payprice
   */
  payInfoStatus(
    restpayprice: number,
    payprice: number,
  ): { paystatus: string; expectedrestprice: number } {
    const paystatus = restpayprice === payprice ? 'complete' : 'partpay';
    const expectedrestprice = restpayprice - payprice;
    return { paystatus: paystatus, expectedrestprice: expectedrestprice };
  }

  /**
   * 현금결제
   * @param payDto
   * @param restpayprice
   */
  async cashPay(payDto: PayDto, restpayprice: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      // 결제상태, 결제후 남은금액 조회
      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );

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
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 카드결제
   * @param payDto
   * @param restpayprice
   */
  async cardPay(payDto: PayDto, restpayprice: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );

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
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 후불결제
   * @param payDto
   * @param restpayprice
   */
  async afterPay(payDto: PayDto, restpayprice: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const { paystatus, expectedrestprice } = this.payInfoStatus(
        restpayprice,
        payDto.payprice,
      );

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
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
