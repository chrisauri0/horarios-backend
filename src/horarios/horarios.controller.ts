import { Controller, Get, Post, } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { Body, Param, Put, Delete } from '@nestjs/common';
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}


  @Get()
  async getHorarios() {
    return this.horariosService.findAll();
  }
}
