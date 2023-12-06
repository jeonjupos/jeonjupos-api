import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { PayService } from './pay.service';
import { ResponseUtil } from '../util/response/response.util';
import { PayDto } from './dto/pay.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pay')
export class PayController {
  constructor(
    private payService: PayService,
    private responseUtil: ResponseUtil,
  ) {}

  /**
   * 결제
   * @param res
   * @param payDto
   */
  @Post('/')
  @UseGuards(AuthGuard('auth-jwt'))
  async pay(@Response() res: Response, @Body() payDto: PayDto) {
    try {
      let payResult: { result: boolean; message: string };
      let restpayprice: number; // 결제해야할 금액 조회

      // 주문정보 조회
      const orderinfo = await this.payService.getOrderInfo(
        payDto.orderinfopkey,
      );

      if (orderinfo === null) {
        return this.responseUtil.response(res, 200, '0011', '', {});
      } else {
        // 결제정보 조회
        const payinfos = await this.payService.getPayInfos(
          payDto.orderinfopkey,
        );
        // 결제할 수 있는 금액 조회
        if (payinfos.length === 0) {
          restpayprice = orderinfo.orderprice;
        } else {
          const payinfo = payinfos[0];
          restpayprice = payinfo.expectedrestprice;
        }

        // 결제금액 유효성 체크
        if (payDto.payprice > restpayprice) {
          // 결제 요청 금액이 결제할 수 있는 금액보다 큼
          return this.responseUtil.response(res, 200, '0013', '', {});
        }

        if (payDto.paytype === 'cash') {
          payResult = await this.payService.cashPay(
            payDto,
            orderinfo,
            restpayprice,
          );
        } else if (payDto.paytype === 'card') {
          payResult = await this.payService.cardPay(
            payDto,
            orderinfo,
            restpayprice,
          );
        } else if (payDto.paytype === 'after') {
          payResult = await this.payService.afterPay(
            payDto,
            orderinfo,
            restpayprice,
          );
        }
      }

      if (payResult.result === false) {
        return this.responseUtil.response(
          res,
          200,
          '0000',
          payResult.message,
          {},
        );
      } else {
        if (payDto.payprice === restpayprice) {
          // 주문서 정보 결제완료여부 변경, 테이블 식사여부 변경
          await this.payService.payCompleteModify(orderinfo);
        }
        return this.responseUtil.response(res, 200, '0000', '', {});
      }
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', err.message, {});
    }
  }
}
