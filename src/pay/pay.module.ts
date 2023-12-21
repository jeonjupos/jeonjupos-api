import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './service/pay.service';
import { PayModel } from './pay.model';
import { GetOrderInfoService } from "./service/get-order-info.service";
import { GetPayInfoListService } from "./service/get-pay-info-list.service";
import { PayCompleteModifyService } from "./service/pay-complete-modify.service";

@Module({
  controllers: [PayController],
  providers: [PayService, GetOrderInfoService, GetPayInfoListService, PayCompleteModifyService, PayModel],
})
export class PayModule {}
