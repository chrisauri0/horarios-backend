import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfesoresService } from './profesores.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.profesoresService.findAllByOrg(req.user.organizacionId);
  }

  @Get('/movil')
  async getAllMovil(@Req() req: any) {
    return this.profesoresService.findAllMovil(req.user.organizacionId);
  }

  @Get('/tutores')
  async getAllTutors(@Req() req: any) {
    return this.profesoresService.findAllTutors(req.user.organizacionId);
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') profesor_id: string) {
    return this.profesoresService.findById(req.user.organizacionId, profesor_id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: {
      nombre: string;
      apellidos: string;
      email: string;
      can_be_tutor?: boolean;
      materias?: object;
      metadata?: object;
      disponibilidad?: object;
    },
    // 👆 quité organizacionId de aquí: nunca debe venir del cliente
  ) {
    return this.profesoresService.create({
      ...body,
      organizacionId: req.user.organizacionId, // 👈 siempre del JWT
    });
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') profesor_id: string,
    @Body() body: Partial<{
      nombre: string;
      apellidos: string;
      email: string;
      can_be_tutor?: boolean;
      materias?: object;
      metadata?: object;
      disponibilidad?: object;
    }>,
  ) {
    return this.profesoresService.update(req.user.organizacionId, profesor_id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') profesor_id: string) {
    return this.profesoresService.delete(req.user.organizacionId, profesor_id);
  }
}