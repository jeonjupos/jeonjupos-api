import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTableDto {
  @IsNotEmpty()
  @IsNumber()
  spacepkey: number;
}
