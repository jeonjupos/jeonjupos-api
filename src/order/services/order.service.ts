import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { FirstOrderDto, OrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
  ) {}

  /**
   * 주문서 정보 생성
   * @param firstOrderDto
   * @param orderPrice
   */
  async createOrderInfo(
    firstOrderDto: FirstOrderDto,
    orderPrice: number,
  ): Promise<number> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const firstOrder = await this.orderModel.firstOrder(
        this.connection,
        firstOrderDto,
        orderPrice,
      );
      await this.connection.commit();
      return firstOrder.insertId;
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 번호표 생성
   * @param orderinfopkey
   * @param ordernum
   */
  async createOrderNumTicket(orderinfopkey: number, ordernum: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      const ordernumticket = await this.orderModel.createOrderNumTicket(
        this.connection,
        orderinfopkey,
        ordernum,
      );

      await this.connection.commit();
      return ordernumticket.insertId;
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 주문메뉴 생성
   * @param orderList
   * @param ordernumticketpkey
   */
  async order(orderDto: OrderDto, ordernumticketpkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      await this.connection.commit();
    } catch (err) {
      if (err.name === 'DBError') {
        await this.connection.rollback();
      }
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
