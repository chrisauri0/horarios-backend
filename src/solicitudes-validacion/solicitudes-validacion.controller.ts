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
import { SolicitudesValidacionService } from "./solicitudes-validacion.service";
import { CreateSolicitudDto } from "./dto/create-solicitud.dto";
import { UpdateEstadoSolicitudDto } from "./dto/update-estado-solicitud.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("solicitudes-validacion")
export class SolicitudesValidacionController {
  constructor(private readonly service: SolicitudesValidacionService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateSolicitudDto) {
    return this.service.create(req.user.email, req.user.organizacionId, dto);
  }

  @Get("mias")
  findMine(@Req() req: any) {
    return this.service.findMine(req.user.email);
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
    @Body() dto: UpdateEstadoSolicitudDto,
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