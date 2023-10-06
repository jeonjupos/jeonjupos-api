import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderMenuDto {
  @IsNotEmpty()
  @IsNumber()
  menupkey: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsBoolean()
  cancelyn: boolean;
}

/**
 * 주문
 */
export class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  orderinfopkey: number; // 첫 주문시 0, 재주문시 orderinfopkey

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  spacepkey: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  storepkey: number;

  @IsOptional()
  @IsBoolean()
  @IsIn([true, false])
  deliveryyn: boolean;

  @IsOptional()
  @IsString()
  deliveryaddress: string;

  @IsOptional()
  @IsBoolean()
  @IsIn([true, false])
  reserveyn: boolean;

  @IsOptional()
  @IsDateString()
  reservedate: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderMenuDto)
  orderList: OrderMenuDto[];
}
