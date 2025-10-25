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
  async getById(@Param('id') id: number) {
    return this.salonesService.findById(id);
  }

  @Post()
  async create(@Body() body: { nombre_salon: string; nombre_edificio: string; data: object }) {
    return this.salonesService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: Partial<{ nombre_salon: string; nombre_edificio: string; data: object }>
  ) {
    return this.salonesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.salonesService.delete(id);
  }
}
