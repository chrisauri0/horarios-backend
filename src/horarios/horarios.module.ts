import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { PythonService } from 'src/python/python.service';


@Module({
  controllers: [HorariosController],
  providers: [HorariosService, PythonService],
})
export class HorariosModule {}
