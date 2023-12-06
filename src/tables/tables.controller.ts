import { Controller, Get, Query, Response, UseGuards } from '@nestjs/common';
import { GetTablesDto } from './dto/get-tables.dto';
import { ResponseUtil } from '../util/response/response.util';
import { TablesService } from './tables.service';
import { GetTableDto } from './dto/get-table.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('table')
export class TablesController {
  constructor(
    private responseUtil: ResponseUtil,
    private tablesService: TablesService,
  ) {}

  /**
   * 테이블 목록 조회
   * @param getTablesDto
   * @param res
   */
  @Get('/list')
  @UseGuards(AuthGuard('auth-jwt'))
  async getTableList(
    @Query() getTablesDto: GetTablesDto,
    @Response() res: Response,
  ) {
    try {
      const tables = await this.tablesService.getTableList(getTablesDto);
      return this.responseUtil.response(res, 200, '0000', '', {
        tables: tables,
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * 테이블 상세조회
   * @param getTableDto
   * @param res
   */
  @Get('')
  @UseGuards(AuthGuard('auth-jwt'))
  async getTable(@Query() getTableDto: GetTableDto, @Response() res: Response) {
    try {
      const tableorder = await this.tablesService.getTable(getTableDto);
      return this.responseUtil.response(res, 200, '0000', '', {
        tableorder,
      });
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
