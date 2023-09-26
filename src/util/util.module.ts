import { Global, Module } from '@nestjs/common';
import { ResponseUtil } from './response.util';
import { PasswordBcryptUtil } from './password-bcrypt.util';
import { JwtSignUtil } from './jwt-sign.util';

@Global()
@Module({
  providers: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil],
  exports: [ResponseUtil, PasswordBcryptUtil, JwtSignUtil],
})
export class UtilModule {}
