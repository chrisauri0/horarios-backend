import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarrerasService } from './carreras.service';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}
  @Get()
  findAll() {
    return this.carrerasService.findAll();
  } 
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.carrerasService.findById(id);
  }
  @Post()
  async create(@Body() createCarreraDto: { nombre: string; division: string, grado :number }) {
  
    const existentes = await this.carrerasService.findByNombre(createCarreraDto.nombre);
    if (existentes && existentes.length > 0) {
      return { error: 'Ya existe una carrera con ese nombre.' };
    }
    return this.carrerasService.create(createCarreraDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarreraDto: Partial<{ nombre: string; division: string, grado :number }>) {
    return this.carrerasService.update(id, updateCarreraDto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.carrerasService.delete(id);
  }

}
