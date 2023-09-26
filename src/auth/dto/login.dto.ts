import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  ownerid: string;

  @IsNotEmpty()
  @IsString()
  ownerpassword: string;
}
