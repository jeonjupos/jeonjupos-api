import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './util/config/configuration';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UtilModule } from './util/util.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 다른 모듈에서 별도의 설정없이 환경변수의 사용이 가능합니다.
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      renderPath: '/',
    }),
    DatabaseModule,
    UtilModule,
    AuthModule,
    MenuModule,
    MenuCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
