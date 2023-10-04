import { Global, Module } from '@nestjs/common';
import { ResponseUtil } from './response/response.util';
import { PasswordBcryptUtil } from './password/password-bcrypt.util';
import { JwtSignUtil } from './jwt/jwt-sign.util';

@Global()
@Module({
  providers: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil],
  exports: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil],
})
export class UtilModule {}
