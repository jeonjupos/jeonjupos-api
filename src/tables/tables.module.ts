import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesModel } from './tables.model';
import { GetTableService } from "./service/get-table.service";
import { GetTableListService } from "./service/get-table-list.service";

@Module({
  controllers: [TablesController],
  providers: [GetTableService, GetTableListService, TablesModel],
})
export class TablesModule {}
