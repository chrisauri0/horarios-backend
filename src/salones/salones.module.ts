import { Module } from '@nestjs/common';
import { SalonesService } from './salones.service';
import { SalonesController } from './salones.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [SalonesController],
  providers: [SalonesService],

})
export class SalonesModule {}
