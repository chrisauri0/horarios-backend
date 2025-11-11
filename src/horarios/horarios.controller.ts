import { Controller, Get } from '@nestjs/common';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Get()
  async findAll() {
    return this.horariosService.findAll();
  }
}
