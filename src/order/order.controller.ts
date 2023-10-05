import { Controller, UseGuards, Response, Body, Post } from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { JwtAuthGuard } from '../util/jwt/jwt-auth.guard';
import { OrderService } from './services/order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(
    private responseUtil: ResponseUtil,
    private orderService: OrderService,
  ) {}

  /**
   * 취소건으로 변경시 취소건으로 저장함
   * @param res
   * @param orderDto
   */
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async order(@Response() res: Response, @Body() orderDto: OrderDto) {
    try {
      // 주문서 생성 및 수정, 번호표 생성, 주문메뉴 생성
      const orderinfopkey = await this.orderService.order(orderDto);
      return this.responseUtil.response(res, 200, '0000', '', {
        orderinfopkey: orderinfopkey,
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
