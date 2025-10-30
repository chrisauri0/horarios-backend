import { MateriasService } from './materias.service';
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';


@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  async getAll() {
    return this.materiasService.findAll();
  }
  @Get('hash')
  async getHash() {
    return this.materiasService.getHash();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.materiasService.findById(id);
  }

  @Post()
  async create(@Body() body: { nombre: string; data?: object }) {
    return this.materiasService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; data?: object }>
  ) {
    return this.materiasService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.materiasService.delete(id);
  }
}
