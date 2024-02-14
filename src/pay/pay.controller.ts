import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { PayService } from './service/pay.service';
import { ResponseUtil } from '../util/response/response.util';
import { PayDto } from './dto/pay.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetOrderInfoService } from './service/get-order-info.service';
import { GetPayInfoListService } from './service/get-pay-info-list.service';
import { PayCompleteModifyService } from './service/pay-complete-modify.service';

@Controller('pay')
export class PayController {
  constructor(
    private payService: PayService,
    private responseUtil: ResponseUtil,
    private getOrderInfoService: GetOrderInfoService,
    private getPayInfoListService: GetPayInfoListService,
    private payCompleteModifyService: PayCompleteModifyService,
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
      const orderinfo = await this.getOrderInfoService.getOrderInfo(
        payDto.orderinfopkey,
      );

      if (orderinfo === null) {
        return this.responseUtil.response(res, 200, '0011', '', {});
      } else {
        // 결제정보 조회
        const payinfoSet = await this.getPayInfoListService.getPayInfoList(
          payDto.orderinfopkey,
        );
        // 결제할 수 있는 금액 조회
        if (payinfoSet.length === 0) {
          restpayprice = orderinfo.orderprice;
        } else {
          const payinfo = payinfoSet[0];
          restpayprice = payinfo.expectedrestprice; // 마지막 결제후 남은 금액
        }

        // 결제금액 유효성 체크
        if (payDto.payprice > restpayprice) {
          // 결제 요청 금액이 결제할 수 있는 금액보다 큼
          return this.responseUtil.response(res, 200, '0013', '', {});
        }

        if (payDto.paytype === 'cash') {
          payResult = await this.payService.cashPay(payDto, restpayprice);
        } else if (payDto.paytype === 'card') {
          payResult = await this.payService.cardPay(payDto, restpayprice);
        } else if (payDto.paytype === 'after') {
          payResult = await this.payService.afterPay(payDto, restpayprice);
        }
      }

      if (payResult.result === false) {
        return this.responseUtil.response(
          res,
          200,
          '0012',
          payResult.message,
          {},
        );
      } else {
        if (payDto.payprice === restpayprice) {
          // 주문서 정보 결제완료여부 변경, 테이블 식사여부 변경
          await this.payCompleteModifyService.payCompleteModify(orderinfo);
        }
        return this.responseUtil.response(res, 200, '0000', '', {});
      }
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', err.message, {});
    }
  }
}
