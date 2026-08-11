import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GruposService } from './grupos.service';

@UseGuards(AuthGuard('jwt'))
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.gruposService.findAllByOrg(req.user.organizacionId);
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    return this.gruposService.findById(req.user.organizacionId, id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { nombre: string; data?: object; grado: number; carrera: string },
  ) {
    return this.gruposService.create({
      ...body,
      organizacionId: req.user.organizacionId,
    });
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ nombre: string; data?: object; grado: number; carrera: string }>,
  ) {
    return this.gruposService.update(req.user.organizacionId, id, body);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.gruposService.delete(req.user.organizacionId, id);
  }
}