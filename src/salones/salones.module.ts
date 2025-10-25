import { Module } from '@nestjs/common';
import { SalonesService } from './salones.service';
import { SalonesController } from './salones.controller';

@Module({
  controllers: [SalonesController],
  providers: [SalonesService],
})
export class SalonesModule {}
