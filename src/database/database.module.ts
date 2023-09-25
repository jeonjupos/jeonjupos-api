import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // @Global() 데코레이터는 모듈을 전역으로 사용할 수 있도록 만듭니다.
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
