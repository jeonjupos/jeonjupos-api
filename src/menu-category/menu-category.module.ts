import { Module } from '@nestjs/common';
import { MenuCategoryController } from './menu-category.controller';
import { GetCategoryListService } from './service/get-category-list.service';
import { MenuCategoryModel } from './menu-category.model';

@Module({
  controllers: [MenuCategoryController],
  providers: [GetCategoryListService, MenuCategoryModel],
})
export class MenuCategoryModule {}
