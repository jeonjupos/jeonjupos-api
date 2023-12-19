import { Controller, Query, Response, UseGuards, Get } from '@nestjs/common';
import { ResponseUtil } from '../util/response/response.util';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu')
export class MenuController {
  constructor(
    private responseUtil: ResponseUtil,
    private menuService: MenuService,
  ) {}

  /**
   * 카테고리별 메뉴 목록 조회
   * @param res
   * @param getMenuListDto
   */
  @Get('/list')
  @UseGuards(AuthGuard('auth-jwt'))
  async getMenuList(
    @Response() res: Response,
    @Query() getMenuListDto: GetMenuListDto,
  ) {
    try {
      return this.responseUtil.response(res, 200, '0000', '', {
        menulist: await this.menuService.getMenuList(getMenuListDto),
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
