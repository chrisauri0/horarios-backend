import { Injectable } from "@nestjs/common";

import { PrismaService } from 'prisma/prisma.service';
import { CreateJustificanteDto } from "./dto/create-justificante.dto";
import { UpdateEstadoDto } from "./dto/update-estado.dto";


@Injectable()
export class JustificantesService {
  constructor(private prisma: PrismaService) {}

  create(usuarioId: string, dto: CreateJustificanteDto) {
    return this.prisma.justificante.create({
      data: {
        usuarioId,
        motivo: dto.motivo,
        fecha: new Date(dto.fecha),
        driveUrl: dto.driveUrl,
      },
    });
  }

  findMine(usuarioId: string) {
    return this.prisma.justificante.findMany({
      where: { usuarioId },
      orderBy: { createdAt: "desc" },
    });
  }


  findAll() {
  return this.prisma.justificante.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      usuario: {
        select: { id: true, full_name: true, email: true },
      },
    },
  });
}

updateEstado(id: string, dto: UpdateEstadoDto) {
  return this.prisma.justificante.update({
    where: { id },
    data: {
      estado: dto.estado,
      comentarioAdmin: dto.comentarioAdmin,
    },
  });
}
}