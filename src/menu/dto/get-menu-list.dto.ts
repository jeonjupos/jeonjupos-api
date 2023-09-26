import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMenuListDto {
  @IsNotEmpty()
  @IsNumber()
  categorypkey: number;
}
