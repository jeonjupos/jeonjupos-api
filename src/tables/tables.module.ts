import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { TablesModel } from './tables.model';

@Module({
  controllers: [TablesController],
  providers: [TablesService, TablesModel],
})
export class TablesModule {}
