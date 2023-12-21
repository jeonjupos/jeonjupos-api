import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { OrderModel } from './order.model';
import { OrderCodeGeneratorService } from './services/order-code-generator.service';
import { OrderMenuService } from './services/order-menu.service';
import { GetSpaceValidService } from "./services/get-space-valid.service";

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderModel,
    OrderMenuService,
    OrderCodeGeneratorService,
    GetSpaceValidService,
  ],
})
export class OrderModule {}
