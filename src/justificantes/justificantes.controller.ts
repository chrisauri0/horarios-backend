import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Patch,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { JustificantesService } from "./justificantes.service";
import { CreateJustificanteDto } from "./dto/create-justificante.dto";
import { UpdateEstadoDto } from "./dto/update-estado.dto";

import { ForbiddenException } from "@nestjs/common";

@UseGuards(AuthGuard('jwt')) // 👈 faltaba a nivel de clase
@Controller("justificantes")
export class JustificantesController {
  constructor(private readonly justificantesService: JustificantesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateJustificanteDto) {
    const usuarioId = req.user.userId;
    const organizacionId = req.user.organizacionId;
    return this.justificantesService.create(usuarioId, dto, organizacionId);
  }

  @Get("mios")
  findMine(@Req() req: any) {
    const usuarioId = req.user.userId;
    return this.justificantesService.findMine(usuarioId);
  }

@Get("admin")
findAll(@Req() req: any) {
  if (req.user.role !== 'administrador' && req.user.role !== 'super_admin') {
    throw new ForbiddenException('No autorizado.');
  }
  return this.justificantesService.findAllByOrg(req.user.organizacionId);
}

@Patch("admin/:id/estado")
updateEstado(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateEstadoDto) {
  if (req.user.role !== 'administrador' && req.user.role !== 'super_admin') {
    throw new ForbiddenException('No autorizado.');
  }
  return this.justificantesService.updateEstado(req.user.organizacionId, id, dto);
}
}