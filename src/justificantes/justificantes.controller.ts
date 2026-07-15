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
import { JustificantesService } from "./justificantes.service";
import { CreateJustificanteDto } from "./dto/create-justificante.dto";
import { UpdateEstadoDto } from "./dto/update-estado.dto";



@Controller("justificantes")
export class JustificantesController {
  constructor(private readonly justificantesService: JustificantesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateJustificanteDto) {
    const usuarioId = req.user.id; // sacado del JWT
    return this.justificantesService.create(usuarioId, dto);
  }

  @Get("mios")
  findMine(@Req() req: any) {
    const usuarioId = req.user.id;
    return this.justificantesService.findMine(usuarioId);
  }



  @Get("admin")

  findAll() {
    return this.justificantesService.findAll();
  }

  @Patch("admin/:id/estado")
  updateEstado(@Param("id") id: string, @Body() dto: UpdateEstadoDto) {
    return this.justificantesService.updateEstado(id, dto);
  }
}