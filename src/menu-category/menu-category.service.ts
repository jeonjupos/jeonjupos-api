import { Injectable } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service';
import { GetCategoryListDto } from './dto/menu-category.dto';
import { MenuCategoryModel } from './menu-category.model';

@Injectable()
export class MenuCategoryService {
  private connection: PoolConnection;

  constructor(
    private databaseService: DatabaseService,
    private menuCategoryModel: MenuCategoryModel,
  ) {}

  async getCategoryList(
    getCategoryListDto: GetCategoryListDto,
  ): Promise<any[]> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      const categorylist = await this.menuCategoryModel.getCategoryList(
        this.connection,
        getCategoryListDto,
      );
      return categorylist;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
