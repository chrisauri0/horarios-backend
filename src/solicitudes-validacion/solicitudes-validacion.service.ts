import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSolicitudDto } from "./dto/create-solicitud.dto";
import { UpdateEstadoSolicitudDto } from "./dto/update-estado-solicitud.dto";

@Injectable()
export class SolicitudesValidacionService {
  constructor(private prisma: PrismaService) {}

  create(
    correoAlumno: string,
    organizacionId: string,
    dto: CreateSolicitudDto,
  ) {
    return this.prisma.solicitudes_validacion.create({
      data: {
        matricula: dto.matricula,
        nombre_solicitud: dto.nombreSolicitud,
        correo_alumno: correoAlumno, // 👈 viene del JWT, no del body
        eje: dto.eje,
        persona_encargada: dto.personaEncargada,
        puesto: dto.puesto,
        telefono: dto.telefono,
        extension: dto.extension,
        correo: dto.correo,
        tipo: "externa", // 👈 hardcodeado, nunca del frontend
        horas_requeridas: dto.horasRequeridas,
        // Placeholders: el admin los define de verdad al aprobar
        nivel_de_impacto: "1",
        tdis_por_ganar: 0,
        competencias: dto.competencias,
        evidencias: dto.evidencias,
        observaciones: dto.observaciones,
        organizacionId,
      },
    });
  }

  findMine(correoAlumno: string) {
    return this.prisma.solicitudes_validacion.findMany({
      where: { correo_alumno: correoAlumno },
      orderBy: { created_at: "desc" },
    });
  }

  findAllByOrg(organizacionId: string) {
    return this.prisma.solicitudes_validacion.findMany({
      where: { organizacionId },
      orderBy: { created_at: "desc" },
    });
  }

  async updateEstado(
    id: string,
    organizacionId: string,
    dto: UpdateEstadoSolicitudDto,
  ) {
    const solicitud = await this.prisma.solicitudes_validacion.findFirst({
      where: { id, organizacionId },
    });
    if (!solicitud) {
      throw new NotFoundException("Solicitud no encontrada en esta organización.");
    }

    if (dto.estado === "Rechazada") {
      return this.prisma.solicitudes_validacion.update({
        where: { id },
        data: { estado: "Rechazada" },
      });
    }

    // estado === "Aprobada": actualiza la solicitud Y crea el TDI en el catálogo, atómico
    const [solicitudActualizada] = await this.prisma.$transaction([
      this.prisma.solicitudes_validacion.update({
        where: { id },
        data: { estado: "Aprobada" },
      }),
      this.prisma.tdis.create({
        data: {
          eje: solicitud.eje,
          nombre: solicitud.nombre_solicitud,
          persona_encargada: solicitud.persona_encargada,
          puesto: solicitud.puesto,
          telefono: solicitud.telefono,
          extension: solicitud.extension,
          correo: solicitud.correo,
          tipo: solicitud.tipo,
          horas_requeridas: solicitud.horas_requeridas,
          nivel_de_impacto: dto.nivelDeImpacto!,
          tdis_por_ganar: dto.tdisPorGanar!,
          competencias: solicitud.competencias,
          evidencias: solicitud.evidencias,
          observaciones: solicitud.observaciones,
          cupo_maximo: dto.cupoMaximo!,
          cupo_actual: 0,
          fecha: dto.fecha ? new Date(dto.fecha) : null,
          lugar: dto.lugar,
          emoji: dto.emoji ?? "🎯",
          organizacionId,
        },
      }),
    ]);

    return solicitudActualizada;
  }
}