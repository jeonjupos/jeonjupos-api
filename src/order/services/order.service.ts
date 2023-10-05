import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderDto, OrderMenuDto } from '../dto/order.dto';
import { OrderCodeGeneratorService } from './order-code-generator.service';
import { OrderMenuService } from './order-menu.service';

@Injectable()
export class OrderService {
  private connection: PoolConnection;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
    private orderMenuService: OrderMenuService,
    private orderCodeGeneratorService: OrderCodeGeneratorService,
  ) {}

  /**
   * 테이블 조회
   * @param connection
   * @param spacepkey
   */
  async getSpace(connection: PoolConnection, spacepkey: number) {
    try {
      // 테이블 조회
      const space = await this.orderModel.getSpace(connection, spacepkey);
      // 테이블 식사중으로 변경
      await this.orderModel.modifySpaceEating(connection, spacepkey);
      return space[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문메뉴 생성
   * @param orderDto
   */
  async order(orderDto: OrderDto): Promise<number> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();
      if (orderDto.orderinfopkey === 0) {
        // 테이블 조회 및 식사 중으로 변경
        await this.getSpace(this.connection, orderDto.spacepkey);
        // 주문서 생성
        const orderInfo = await this.orderModel.createOrderInfo(
          this.connection,
          orderDto,
        );
        orderDto.orderinfopkey = orderInfo.orderinfopkey;
      }
      // 주문번호 조회
      const ordercode = await this.orderCodeGeneratorService.orderCodeGenerator(
        this.connection,
        orderDto.storepkey,
      );
      // 번호표 생성
      const ordernumticket = await this.orderModel.createOrderNumTicket(
        this.connection,
        orderDto.orderinfopkey,
        ordercode,
      );
      // 주문메뉴 조회
      const { orderPrice, orderMenuList } =
        await this.orderMenuService.getOrderMenu(
          this.connection,
          ordernumticket.insertId,
          orderDto.orderList,
        );
      // 주문메뉴 생성
      await this.orderModel.createOrderMenu(this.connection, orderMenuList);

      // 주문서 주문금액 수정
      await this.orderModel.modifyOrderInfoOrderPrice(
        this.connection,
        orderDto.orderinfopkey,
        orderPrice,
      );

      await this.connection.commit();
      return orderDto.orderinfopkey;
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
