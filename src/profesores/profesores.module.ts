import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProfesoresController],
  providers: [ProfesoresService, JwtService],
})
export class ProfesoresModule {}
