import { Global, Module } from '@nestjs/common';
import { ResponseUtil } from './response/response.util';
import { PasswordBcryptUtil } from './password/password-bcrypt.util';
import { JwtSignUtil } from './jwt/jwt-sign.util';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil, JwtService],
  exports: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil],
})
export class UtilModule {}
