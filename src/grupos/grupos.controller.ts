import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { GruposService } from './grupos.service';

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}
  
  @Get()
  async getAll() {
    return this.gruposService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') grupo_id: string) {
    return this.gruposService.findById(grupo_id);
  }

  @Post()
  async create(@Body() body: { name: string; tutor_id?: string; metadata?: object }) {
    return this.gruposService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') grupo_id: string,
    @Body() body: Partial<{ name: string; tutor_id?: string; metadata?: object }>
  ) {
    return this.gruposService.update(grupo_id, body);
  }

  @Delete(':id')
  async delete(@Param('id') grupo_id: string) {
    return this.gruposService.delete(grupo_id);
  }
}
