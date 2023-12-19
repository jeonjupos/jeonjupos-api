import {
  Controller,
  UseGuards,
  Response,
  Body,
  Post,
  Get,
  Req,
  Query,
} from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { OrderService } from './services/order.service';
import { OrderDto } from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetDeliveryOrderListDto } from './dto/get-delivery-order-list.dto';

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
  @UseGuards(AuthGuard('auth-jwt'))
  @Post('/')
  async order(@Response() res: Response, @Body() orderDto: OrderDto) {
    try {
      // 테이블 유효성 체크
      const spaceSet = await this.orderService.getSpaceValid(
        orderDto.spacepkey,
      );
      if (spaceSet.length === 0) {
        // 테이블 조회 안됨
        return this.responseUtil.response(res, 200, '0008', '', {});
      } else if (spaceSet[0].isactiveyn === false) {
        // 비활성화된 테이블
        return this.responseUtil.response(res, 200, '0009', '', {});
      }

      if (orderDto.orderinfopkey === 0) {
        // 첫 주문시 테이블 상태 유효성 체크
        if (spaceSet[0].eatingyn === true) {
          return this.responseUtil.response(res, 200, '0007', '', {});
        }
      }

      // 주문서 생성 및 수정, 번호표 생성, 주문메뉴 생성
      const orderinfopkey = await this.orderService.order(orderDto);
      return this.responseUtil.response(res, 200, '0000', '', {
        orderinfopkey: orderinfopkey,
      });
    } catch (err) {
      if (err.name === 'STOCK_ERR') {
        return this.responseUtil.response(res, 200, '0006', err.message, {});
      } else if (err.name === 'MENU_NOT_FOUND') {
        return this.responseUtil.response(res, 200, '0010', err.message, {});
      }
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * 배달 주문 목록 조회
   * @param req
   * @param res
   * @param getDeliveryOrderListDto
   */
  @Get('/delivery/list')
  @UseGuards(AuthGuard('auth-jwt'))
  async getDeliveryOrderList(
    @Req() req: any,
    @Response() res: Response,
    @Query() getDeliveryOrderListDto: GetDeliveryOrderListDto,
  ) {
    try {
      const storepkey = getDeliveryOrderListDto.storepkey;
      return this.responseUtil.response(res, 200, '0000', '', {
        orderlist: [
          {
            orderpkey: 1,
            address: '보광아파트 6동 404호',
            ordermenus: '칼국수 1개, 된장찌개 2개',
          },
          {
            orderpkey: 1,
            address: '보광아파트 6동 404호',
            ordermenus: '칼국수 1개, 된장찌개 2개',
          },
          {
            orderpkey: 1,
            address: '보광아파트 6동 404호',
            ordermenus: '칼국수 1개, 된장찌개 2개',
          },
        ],
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
