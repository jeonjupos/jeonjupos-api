import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { LoginDto } from './dto/login.dto';
import { AuthLoginService } from './auth-login.service';
import { JwtSignUtil } from '../util/jwt/jwt-sign.util';
import { JwtAuthGuard } from '../util/jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private responseUtil: ResponseUtil,
    private authLoginService: AuthLoginService,
    private jwtSignUtil: JwtSignUtil,
  ) {}

  @Post('/login')
  async login(@Response() res: Response, @Body() loginDto: LoginDto) {
    try {
      // 회원 조회 및 비밀번호 검증
      const owner = await this.authLoginService.login(loginDto);
      if (owner !== null) {
        // 토큰 발급
        const token = await this.jwtSignUtil.sign(owner, owner.ownerpkey);
        return this.responseUtil.response(res, 200, '0000', '', {
          owner: {
            ownerpkey: owner.ownerpkey,
            ownerid: owner.ownerid,
          },
          store: {
            storename: owner.storename,
            storepkey: owner.storepkey,
          },
          token: token,
        });
      } else {
        return this.responseUtil.response(res, 200, '0001', '', {});
      }
    } catch (err) {
      if (err.name === 'UnauthorizedException') {
        return this.responseUtil.response(res, err.status, '8995', '', {});
      }
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  @Post('/jwt/login')
  @UseGuards(JwtAuthGuard)
  async jwtLogin(@Response() res: Response, @Request() req: Request) {
    try {
      const token = req['token'];
      // 토큰으로 회원 조회
      const owner = await this.authLoginService.getOwner(token);
      if (owner === null) {
        return this.responseUtil.response(res, 200, '0014', '', {});
      } else {
        // 토큰 재발급
        const reToken = await this.jwtSignUtil.sign(owner, owner.ownerpkey);
        return this.responseUtil.response(res, 200, '0000', '', {
          owner: {
            ownerpkey: owner.ownerpkey,
            ownerid: owner.ownerid,
          },
          store: {
            storename: owner.storename,
            storepkey: owner.storepkey,
          },
          token: reToken,
        });
      }
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
