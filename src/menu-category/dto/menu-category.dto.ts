import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetCategoryListDto {
  @IsNotEmpty()
  @IsNumber()
  storepkey: number;
}
