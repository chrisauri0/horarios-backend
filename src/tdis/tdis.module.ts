import { Module } from '@nestjs/common';
import { TdisService } from './tdis.service';
import { TdisController } from './tdis.controller';

@Module({
  controllers: [TdisController],
  providers: [TdisService],
})
export class TdisModule {}
