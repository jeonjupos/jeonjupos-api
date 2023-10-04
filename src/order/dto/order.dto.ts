import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
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
 * 첫 주문
 */
export class FirstOrderDto {
  @IsNotEmpty()
  @IsNumber()
  spacepkey: number;

  @IsNotEmpty()
  @IsNumber()
  storepkey: number;

  @IsNotEmpty()
  @IsBoolean()
  deliveryyn: boolean;

  @IsOptional()
  @IsString()
  deliveryaddress: string;

  @IsNotEmpty()
  @IsBoolean()
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

/**
 * 재주문
 */
export class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderinfopkey: number;

  @IsNotEmpty()
  @IsNumber()
  spacepkey: number;

  @IsNotEmpty()
  @IsNumber()
  storepkey: number;

  @IsNotEmpty()
  @IsBoolean()
  deliveryyn: boolean;

  @IsOptional()
  @IsString()
  deliveryaddress: string;

  @IsNotEmpty()
  @IsBoolean()
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
