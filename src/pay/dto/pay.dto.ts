import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PayDto {
  @IsNotEmpty()
  @IsNumber()
  orderinfopkey: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['card', 'cash', 'after'])
  paytype: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  payprice: number;
}
