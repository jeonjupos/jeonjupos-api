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
  orderinfopkey: number; // 첫 주문시 0, 재주문시 orderinfopkey

  @IsNotEmpty()
  @IsNumber()
  spacepkey: number;

  @IsNotEmpty()
  @IsNumber()
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
