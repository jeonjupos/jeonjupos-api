import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { GetMenuListService } from './service/get-menu-list.service';
import { MenuModel } from './menu.model';

@Module({
  controllers: [MenuController],
  providers: [GetMenuListService, MenuModel],
})
export class MenuModule {}
