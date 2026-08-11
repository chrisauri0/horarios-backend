import { MateriasService } from './materias.service';
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.materiasService.findAllByOrg(req.user.organizacionId);
  }

  @Get('hash')
  async getHash(@Req() req: any) {
    return this.materiasService.getHash(req.user.organizacionId);
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    return this.materiasService.findById(req.user.organizacionId, id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { nombre: string; data?: object; grado: number; carrera: string; horas_semana: number; salones?: object },
    // 👆 quité organizacionId de aquí: nunca debe venir del cliente
  ) {
    return this.materiasService.create({
      ...body,
      organizacionId: req.user.organizacionId, // 👈 siempre del JWT
    });
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; data?: object; grado: number; carrera: string; horas_semana: number; salones?: object }>,
  ) {
    return this.materiasService.update(req.user.organizacionId, id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.materiasService.delete(req.user.organizacionId, id);
  }
}