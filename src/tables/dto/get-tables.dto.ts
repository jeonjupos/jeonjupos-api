import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTablesDto {
  @IsNotEmpty()
  @IsNumber()
  storepkey: number;
}
