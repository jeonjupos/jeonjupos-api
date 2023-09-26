import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuModel } from './menu.model';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuModel],
})
export class MenuModule {}
