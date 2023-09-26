import { Module } from '@nestjs/common';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryModel } from './menu-category.model';

@Module({
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService, MenuCategoryModel],
})
export class MenuCategoryModule {}
