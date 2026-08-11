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
    return this.justificantesService.findAllByOrg(req.user.organizacionId);
  }

  @Patch("admin/:id/estado")
  updateEstado(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateEstadoDto) {
    return this.justificantesService.updateEstado(req.user.organizacionId, id, dto);
  }
}