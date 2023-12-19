import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDeliveryOrderListDto {
  @IsNotEmpty()
  @IsNumber()
  storepkey: number;
}
