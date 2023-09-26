import { Controller, Get, UseGuards, Response, Query } from '@nestjs/common';
import { ResponseUtil } from '../util/response.util';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { MenuCategoryService } from './menu-category.service';

@Controller('menu-category')
export class MenuCategoryController {
  constructor(
    private responseUtil: ResponseUtil,
    private menuCategoryService: MenuCategoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async menuCategoryList(
    @Response() res: Response,
    @Query() getCategoryListDto: GetCategoryListDto,
  ) {
    try {
      const categorylist = await this.menuCategoryService.getCategoryList(
        getCategoryListDto,
      );
      return this.responseUtil.response(res, 200, '0000', '', {
        categorylist: categorylist,
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
