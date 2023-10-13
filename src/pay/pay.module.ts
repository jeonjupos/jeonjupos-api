import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { PayModel } from './pay.model';

@Module({
  controllers: [PayController],
  providers: [PayService, PayModel],
})
export class PayModule {}
