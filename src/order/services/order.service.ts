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
  private orderPrice: number;
  private orderMenuList: any[];
  private orderInfoPkey: number;
  constructor(
    private databaseService: DatabaseService,
    private orderModel: OrderModel,
    private orderMenuService: OrderMenuService,
    private orderCodeGeneratorService: OrderCodeGeneratorService,
  ) {}

  /**
   * 주문메뉴 조회
   * @param orderNumTicketPkey
   * @param orderList
   */
  async getOrderMenu(orderNumTicketPkey: number, orderList: any[]) {
    const { orderPrice, orderMenuList } =
      await this.orderMenuService.getOrderMenu(
        this.connection,
        orderNumTicketPkey,
        orderList,
      );
    this.orderPrice = orderPrice;
    this.orderMenuList = orderMenuList;
  }

  /**
   * 테이블 식사 중으로 변경
   * @param orderDto
   */
  async modifySpaceEating(orderDto: OrderDto) {
    await this.orderModel.modifySpaceEating(this.connection, orderDto.spacepkey);
    // 주문서 생성
    const orderInfo = await this.orderModel.createOrderInfo(
      this.connection,
      orderDto,
    );
    return orderInfo.insertId;
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

      this.orderInfoPkey = orderDto.orderinfopkey;
      if (this.orderInfoPkey === 0) {
        this.orderInfoPkey = await this.modifySpaceEating(orderDto); // // 테이블 식사 중으로 변경
      }
      // 주문번호 조회
      const ordercode = await this.orderCodeGeneratorService.orderCodeGenerator(
        this.connection,
        orderDto.storepkey,
      );
      // 번호표 생성
      const ordernumticket = await this.orderModel.createOrderNumTicket(
        this.connection,
        this.orderInfoPkey,
        ordercode,
      );
      // 주문메뉴 조회
      await this.getOrderMenu(ordernumticket.insertId, orderDto.orderList);
      // 주문메뉴 생성
      await this.orderModel.createOrderMenu(this.connection, this.orderMenuList);
      // 주문서 주문금액 수정
      await this.orderModel.modifyOrderInfoOrderPrice(
        this.connection,
        this.orderInfoPkey,
        this.orderPrice,
      );

      await this.connection.commit();
      return this.orderInfoPkey;
    } catch (err) {
      await this.connection.rollback();
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
