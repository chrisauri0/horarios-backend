import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InscripcionesTdiService } from "./inscripciones-tdi.service";
import { CreateInscripcionDto } from "./dto/create-inscripcion.dto";
import { SubirEvidenciaDto } from "./dto/subir-evidencia.dto";
import { UpdateEstadoInscripcionDto } from "./dto/update-estado-inscripcion.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("inscripciones-tdi")
export class InscripcionesTdiController {
  constructor(private readonly service: InscripcionesTdiService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateInscripcionDto) {
    return this.service.create(req.user.userId, req.user.organizacionId, dto);
  }

  @Get("mias")
  findMine(@Req() req: any) {
    return this.service.findMine(req.user.userId);
  }

  @Patch(":id/evidencia")
  subirEvidencia(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: SubirEvidenciaDto,
  ) {
    return this.service.subirEvidencia(id, req.user.userId, dto);
  }

  @Get("admin")
  findAllAdmin(@Req() req: any) {
    this.checkAdmin(req);
    return this.service.findAllByOrg(req.user.organizacionId);
  }

  @Patch("admin/:id/estado")
  updateEstadoAdmin(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateEstadoInscripcionDto,
  ) {
    this.checkAdmin(req);
    return this.service.updateEstado(id, req.user.organizacionId, dto);
  }

  private checkAdmin(req: any) {
    if (req.user.role !== "administrador" && req.user.role !== "super_admin") {
      throw new ForbiddenException("No autorizado.");
    }
  }
}