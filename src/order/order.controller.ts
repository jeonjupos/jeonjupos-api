import { Controller, UseGuards, Response, Body, Post } from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { JwtAuthGuard } from '../util/jwt/jwt-auth.guard';
import { OrderService } from './services/order.service';
import { FirstOrderDto, OrderDto } from './dto/order.dto';
import { OrderPriceCalculationService } from './services/order-price-calculation.service';
import { OrderCodeGeneratorService } from './services/order-code-generator.service';

@Controller('order')
export class OrderController {
  constructor(
    private responseUtil: ResponseUtil,
    private orderService: OrderService,
    private orderPriceCalculation: OrderPriceCalculationService,
    private orderCodeGenerator: OrderCodeGeneratorService,
  ) {}

  /**
   * 첫 주문
   * @param res
   * @param firstOrderDto
   */
  @UseGuards(JwtAuthGuard)
  @Post('/first')
  async firstOrder(
    @Response() res: Response,
    @Body() firstOrderDto: FirstOrderDto,
  ) {
    try {
      console.log('첫 주문');
      // 주문상품 총 금액 조회
      const orderPrice = await this.orderPriceCalculation.getOrderTotalPrice(
        firstOrderDto.orderList,
      );
      // 주문서 생성
      const orderinfopkey = await this.orderService.createOrderInfo(
        firstOrderDto,
        orderPrice,
      );
      // 번호표 생성
      const ordercode = await this.orderCodeGenerator.orderCodeGenerator(
        firstOrderDto.storepkey,
      );
      const ordernumticketpkey = await this.orderService.createOrderNumTicket(
        orderinfopkey,
        ordercode,
      );
      // 주문메뉴 생성
      return this.responseUtil.response(res, 200, '0000', '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * 재주문
   * 취소건으로 변경시 취소건으로 저장함
   * @param res
   * @param orderDto
   */
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async order(@Response() res: Response, @Body() orderDto: OrderDto) {
    try {
      console.log('재주문');
      console.log('orderlist : ', orderDto);
      // 주문서 정보 조회
      // 번호표 생성
      // 주문메뉴 생성
      // 주문 총가격 조회
      const orderprice = await this.orderPriceCalculation.getOrderTotalPrice(
        orderDto.orderList,
      );
      // 주문서 정보 수정
      return this.responseUtil.response(res, 200, '0000', '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
