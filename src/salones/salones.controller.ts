import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SalonesService } from './salones.service';

@Controller('salones')
export class SalonesController {
  constructor(private readonly salonesService: SalonesService) {}

  @Get()
  async getAll() {
    return this.salonesService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.salonesService.findById(id);
  }

  @Post()
async create(@Body() body: { nombre: string;  data: object, division: string }) {
  const exists = await this.salonesService.findByNombreYEdificio(body.nombre);
  if (exists) {
    return { error: 'Ya existe un salón con ese nombre.' };
  }
  return this.salonesService.create(body);
}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; data: object; division: string }>,
  ) {
    return this.salonesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.salonesService.delete(id);
  }
}
