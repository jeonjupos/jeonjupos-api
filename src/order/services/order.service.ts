import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderDto } from '../dto/order.dto';
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
   * 테이블 유효성 체크를 위한 조회
   * @param spacepkey
   */
  async getSpaceValid(spacepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      return await this.orderModel.getSpace(this.connection, spacepkey);
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 테이블 식사중으로 변경
   * @param connection
   * @param spacepkey
   */
  async modifySpace(
    connection: PoolConnection,
    spacepkey: number,
  ): Promise<boolean> {
    try {
      // 테이블 식사중으로 변경
      await this.orderModel.modifySpaceEating(connection, spacepkey);
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 주문메뉴 생성
   * 1. 테이블 식사중으로 변경
   * 2. 주문서 생성(첫주문시)
   * 3. 주문번호 조회
   * 4. 번호표 생성
   * 5. 주문메뉴 조회
   * 6. 주문메뉴 생성
   * 7. 주문서 주문금액 변경
   * @param orderDto
   */
  async order(orderDto: OrderDto): Promise<number> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      if (orderDto.orderinfopkey === 0) {
        // 테이블 식사 중으로 변경
        await this.modifySpace(this.connection, orderDto.spacepkey);
        // 주문서 생성
        const orderInfo = await this.orderModel.createOrderInfo(
          this.connection,
          orderDto,
        );
        orderDto.orderinfopkey = orderInfo.insertId;
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
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
