import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { PythonService } from 'src/python/python.service';
import { PythonModule } from 'src/python/python.module';


@Module({
  controllers: [HorariosController],
  imports: [PythonModule],
  providers: [HorariosService],
})
export class HorariosModule {}
