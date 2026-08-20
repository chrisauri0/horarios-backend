import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateInscripcionDto } from "./dto/create-inscripcion.dto";
import { SubirEvidenciaDto } from "./dto/subir-evidencia.dto";
import { UpdateEstadoInscripcionDto } from "./dto/update-estado-inscripcion.dto";

@Injectable()
export class InscripcionesTdiService {
  constructor(private prisma: PrismaService) {}

  async create(alumnoId: string, organizacionId: string, dto: CreateInscripcionDto) {
    const tdi = await this.prisma.tdis.findUnique({ where: { id: dto.tdiId } });

    if (!tdi || tdi.organizacionId !== organizacionId) {
      throw new NotFoundException("Actividad no encontrada en tu organización.");
    }

    if (!tdi.activo) {
      throw new BadRequestException("Esta actividad ya no está disponible.");
    }

    // cupo_maximo es nullable: null significa cupo ilimitado
    if (tdi.cupo_maximo !== null && tdi.cupo_actual >= tdi.cupo_maximo) {
      throw new BadRequestException("No hay cupo disponible para esta actividad.");
    }

    try {
      const [inscripcion] = await this.prisma.$transaction([
        this.prisma.inscripciones_tdi.create({
          data: { tdi_id: dto.tdiId, alumno_id: alumnoId, organizacionId },
        }),
        this.prisma.tdis.update({
          where: { id: dto.tdiId },
          data: { cupo_actual: { increment: 1 } },
        }),
      ]);
      return inscripcion;
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ConflictException("Ya estás inscrito en esta actividad.");
      }
      throw err;
    }
  }

  findMine(alumnoId: string) {
    return this.prisma.inscripciones_tdi.findMany({
      where: { alumno_id: alumnoId },
      orderBy: { fecha_inscripcion: "desc" },
    });
  }

  async subirEvidencia(
    inscripcionId: string,
    alumnoId: string,
    dto: SubirEvidenciaDto,
  ) {
    // 🔴 Ownership check: solo el dueño de la inscripción puede subir su evidencia
    const inscripcion = await this.prisma.inscripciones_tdi.findFirst({
      where: { id: inscripcionId, alumno_id: alumnoId },
    });

    if (!inscripcion) {
      throw new ForbiddenException(
        "No se encontró esa inscripción o no te pertenece.",
      );
    }

    return this.prisma.inscripciones_tdi.update({
      where: { id: inscripcionId },
      data: {
        evidencia_url: dto.evidenciaUrl,
        nota_alumno: dto.nota,
        estado: "en_revision",
      },
    });
  }

  findAllByOrg(organizacionId: string) {
    return this.prisma.inscripciones_tdi.findMany({
      where: { organizacionId },
      orderBy: { fecha_inscripcion: "desc" },
      include: {
        tdi: { select: { nombre: true } },
        alumno: { select: { id: true, full_name: true, email: true } },
      },
    });
  }

  async updateEstado(
    id: string,
    organizacionId: string,
    dto: UpdateEstadoInscripcionDto,
  ) {
    const inscripcion = await this.prisma.inscripciones_tdi.findFirst({
      where: { id, organizacionId },
    });
    if (!inscripcion) {
      throw new NotFoundException("Inscripción no encontrada en esta organización.");
    }
    return this.prisma.inscripciones_tdi.update({
      where: { id },
      data: {
        estado: dto.estado,
        comentario_admin: dto.comentarioAdmin,
        fecha_finalizacion: dto.estado === "aprobado" ? new Date() : undefined,
      },
    });
  }
}