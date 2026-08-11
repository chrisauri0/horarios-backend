import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { SalonesService } from './salones.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('salones')
@UseGuards(AuthGuard('jwt')) // 👈 activado
export class SalonesController {
  constructor(private readonly salonesService: SalonesService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.salonesService.findAllByOrg(req.user.organizacionId); // 👈 filtra por organización
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    return this.salonesService.findById(req.user.organizacionId, id); // 👈 protege también la lectura individual
  }

  @Post()
  async create(@Req() req: any, @Body() body: { nombre: string; data?: object }) {
    const exists = await this.salonesService.findByNombreYEdificio(req.user.organizacionId, body.nombre);
    if (exists) {
      return { error: 'Ya existe un salón con ese nombre.' };
    }
    return this.salonesService.create({
      nombre: body.nombre,
      data: body.data,
      organizacionId: req.user.organizacionId, // 👈 siempre del JWT, nunca del body
    });
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; data: object }>,
    // 👆 quité organizacionId de aquí: nunca debe venir del cliente
  ) {
    return this.salonesService.update(req.user.organizacionId, id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.salonesService.delete(req.user.organizacionId, id);
  }
}