import { Controller } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles/roles.guard';


  
// @UseGuards(RolesGuard)
@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Get()
  async getAll() {
    return this.profesoresService.findAll();
  }
  
  @Get('/tutores')
  async getAllTutors() {
    return this.profesoresService.findAllTutors();
  }

  @Get(':id')
  async getById(@Param('id') profesor_id: string) {
    return this.profesoresService.findById(profesor_id);
  }


  @Post()
  async create(@Body() body: {
    nombre: string;
    apellidos: string;
    email: string;
    can_be_tutor?: boolean;
    materias?: object;
    metadata?: object;
  }) {
    return this.profesoresService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') profesor_id: string,
    @Body() body: Partial<{
      nombre: string;
      apellidos: string;
      email: string;
      can_be_tutor?: boolean;
      materias?: object;
      metadata?: object;
    }>
  ) {
    return this.profesoresService.update(profesor_id, body);
  }

  @Delete(':id')
  async delete(@Param('id') profesor_id: string) {
    return this.profesoresService.delete(profesor_id);
  }
}
