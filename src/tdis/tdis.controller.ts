import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { TdisService } from "./tdis.service";
import { CreateTdiDto } from "./dto/create-tdi.dto";

@UseGuards(AuthGuard('jwt'))
@Controller("tdis")
export class TdisController {
  constructor(private readonly tdisService: TdisService) {}

  @Get()
  findAll(@Req() req: any) {
    // Cualquier usuario logueado de la org puede ver el catálogo
    return this.tdisService.findAll(req.user.organizacionId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTdiDto) {
    this.checkAdmin(req);
    return this.tdisService.create(dto, req.user.organizacionId);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: CreateTdiDto) {
    this.checkAdmin(req);
    return this.tdisService.update(id, dto, req.user.organizacionId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.tdisService.remove(id, req.user.organizacionId);
  }

  private checkAdmin(req: any) {
    if (req.user.role !== 'administrador' && req.user.role !== 'super_admin') {
      throw new ForbiddenException('No autorizado.');
    }
  }
}