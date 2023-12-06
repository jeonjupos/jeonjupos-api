import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthLoginService } from './auth-login.service';
import { AuthModel } from './auth.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../util/config/configuration.interface';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<Configuration['jwt']>('jwt').secret,
        signOptions: { expiresIn: '90d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthLoginService, AuthModel],
})
export class AuthModule {}
