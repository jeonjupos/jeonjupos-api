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

  async getMenuList(getMenuListDto: GetMenuListDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const menuList = await this.menuModel.getMenuList(
        this.connection,
        getMenuListDto,
      );
      return menuList;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
