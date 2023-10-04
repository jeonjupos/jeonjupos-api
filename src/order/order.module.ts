import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { OrderModel } from './order.model';
import { OrderPriceCalculationService } from './services/order-price-calculation.service';
import { OrderCodeGeneratorService } from './services/order-code-generator.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderModel,
    OrderPriceCalculationService,
    OrderCodeGeneratorService,
  ],
})
export class OrderModule {}
