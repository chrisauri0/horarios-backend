import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from 'prisma/prisma.service';
import { CreateJustificanteDto } from "./dto/create-justificante.dto";
import { UpdateEstadoDto } from "./dto/update-estado.dto";

@Injectable()
export class JustificantesService {
  constructor(private prisma: PrismaService) {}

  create(usuarioId: string, dto: CreateJustificanteDto, organizacionId: string) {
    return this.prisma.justificante.create({
      data: {
        usuarioId,
        motivo: dto.motivo,
        fecha: new Date(dto.fecha),
        driveUrl: dto.driveUrl,
        organizacionId,
      },
    });
  }

  findMine(usuarioId: string) {
    return this.prisma.justificante.findMany({
      where: { usuarioId },
      orderBy: { createdAt: "desc" },
    });
  }

  findAllByOrg(organizacionId: string) {
    return this.prisma.justificante.findMany({
      where: { organizacionId }, // 👈 antes devolvía justificantes de TODAS las organizaciones
      orderBy: { createdAt: "desc" },
      include: {
        usuario: {
          select: { id: true, full_name: true, email: true },
        },
      },
    });
  }

  async updateEstado(organizacionId: string, id: string, dto: UpdateEstadoDto) {
    const justificante = await this.prisma.justificante.findFirst({
      where: { id, organizacionId },
    });
    if (!justificante) {
      throw new BadRequestException('Justificante no encontrado en esta organización');
    }
    return this.prisma.justificante.update({
      where: { id },
      data: {
        estado: dto.estado,
        comentarioAdmin: dto.comentarioAdmin,
      },
    });
  }
}