import {
  Controller,
  Query,
  Response,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ResponseUtil } from '../util/response.util';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(
    private responseUtil: ResponseUtil,
    private menuService: MenuService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async getMenuList(
    @Response() res: Response,
    @Query() getMenuListDto: GetMenuListDto,
  ) {
    try {
      const menuList = await this.menuService.getMenuList(getMenuListDto);
      return this.responseUtil.response(res, 200, '0000', '', {
        menuList: menuList,
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
