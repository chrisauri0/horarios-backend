import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PsicologosService } from './psicologos.service';

@UseGuards(AuthGuard('jwt'))
@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly psicologosService: PsicologosService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.psicologosService.findAllByOrg(req.user.organizacionId);
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    return this.psicologosService.findOne(req.user.organizacionId, id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { nombre: string; apellidos: string; email: string; disponibilidad: object },
    // 👆 quité organizacionId de aquí: nunca debe venir del cliente
  ) {
    return this.psicologosService.create({
      ...body,
      organizacionId: req.user.organizacionId, // 👈 siempre del JWT
    });
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; apellidos: string; email: string; disponibilidad: object }>,
  ) {
    return this.psicologosService.update(req.user.organizacionId, id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.psicologosService.delete(req.user.organizacionId, id);
  }
}