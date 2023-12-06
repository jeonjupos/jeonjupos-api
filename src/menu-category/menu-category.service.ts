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

  /**
   * 메뉴 카테고리 목록 조회
   * @param getCategoryListDto
   */
  async getCategoryList(
    getCategoryListDto: GetCategoryListDto,
  ): Promise<any[]> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      return await this.menuCategoryModel.getCategoryList(
        this.connection,
        getCategoryListDto,
      );
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
