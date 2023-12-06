import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetMenuListDto } from './dto/get-menu-list.dto';
import { PoolConnection } from 'mysql2/promise';
import { MenuModel } from './menu.model';

@Injectable()
export class MenuService {
  private connection: PoolConnection;

  constructor(
    private databaseService: DatabaseService,
    private menuModel: MenuModel,
  ) {}

  /**
   * 카테고리별 메뉴 목록 조회
   * @param getMenuListDto
   */
  async getMenuList(getMenuListDto: GetMenuListDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      return await this.menuModel.getMenuList(this.connection, getMenuListDto);
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
