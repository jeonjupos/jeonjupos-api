import { Controller, Get, UseGuards, Response, Query } from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { GetCategoryListService } from './service/get-category-list.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu-category')
export class MenuCategoryController {
  constructor(
    private responseUtil: ResponseUtil,
    private getCategoryListService: GetCategoryListService,
  ) {}

  /**
   * 메뉴 카테고리 목록 조회
   * @param res
   * @param getCategoryListDto
   */
  @Get('/list')
  @UseGuards(AuthGuard('auth-jwt'))
  async menuCategoryList(
    @Response() res: Response,
    @Query() getCategoryListDto: GetCategoryListDto,
  ) {
    try {
      return this.responseUtil.response(res, 200, '0000', '', {
        categorylist: await this.getCategoryListService.getCategoryList(
          getCategoryListDto,
        ),
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
