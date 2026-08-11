import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async findAllTutors(organizacionId: string) {
    return this.prisma.profesores.findMany({
      where: { can_be_tutor: true, organizacionId },
    });
  }

  async findAllByOrg(organizacionId: string) {
    return this.prisma.profesores.findMany({ where: { organizacionId } });
  }

  async findAllMovil(organizacionId: string) {
    return this.prisma.profesores.findMany({
      where: { organizacionId },
      select: {
        nombre: true,
        apellidos: true,
        email: true
      }
    });
  }

  async findById(organizacionId: string, id: string) {
    return this.prisma.profesores.findFirst({
      where: { profesor_id: id, organizacionId },
    });
  }

  async create(data: {
    nombre: string;
    apellidos: string;
    email: string;
    can_be_tutor?: boolean;
    materias?: object;
    metadata?: object;
    disponibilidad?: object;
    organizacionId: string;
  }) {
    return this.prisma.profesores.create({
      data,
    });
  }

  async update(
    organizacionId: string,
    id: string,
    data: Partial<{
      nombre: string;
      apellidos: string;
      email: string;
      can_be_tutor?: boolean;
      materias?: object;
      metadata?: object;
      disponibilidad?: object;
    }>,
  ) {
    const profesor = await this.prisma.profesores.findFirst({ where: { profesor_id: id, organizacionId } });
    if (!profesor) {
      throw new BadRequestException('Profesor no encontrado en esta organización');
    }
    return this.prisma.profesores.update({
      where: { profesor_id: id },
      data,
    });
  }

  async delete(organizacionId: string, id: string) {
    return this.prisma.profesores.deleteMany({ where: { profesor_id: id, organizacionId } });
  }
}