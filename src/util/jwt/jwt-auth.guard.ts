import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../../auth/constants';

/**
 * token 검증
 * 가드(guard)란 애플리케이션의 최전선에서 말그대로 애플리케이션을 보호하는 역할을 담당
 * NestJS로 들어오는 요청은 컨트롤러(controller) 단에 도달하기 전에 반드시 가드를 거쳐가도록 되어 있음.
 * 이 함수는 현재의 request가 실행될 수 있는지 없는지를 나타내는 boolean을 리턴해야 한다. true라면 해당 request는 실행될 것이고, false라면 거절 할 것이다.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('다시 로그인해주세요.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // token 검증
      // const tokenValid = await this.memberTokenService.tokenValidator(
      //   token,
      //   payload.sub,
      // );
      // if (tokenValid === false) {
      //   // 유효하지 않음
      //   return false;
      // }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user_id = payload.user_id;
      request.token = token;
    } catch (err) {
      throw new UnauthorizedException('다시 로그인해주세요.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'jwt' ? token : undefined;
  }
}
