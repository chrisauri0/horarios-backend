import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { validate as isUUID } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  async findAllByOrg(organizacionId: string) {
    return this.prisma.materias.findMany({ where: { organizacionId } });
  }

  async getHash(organizacionId: string) {
    const materias = await this.prisma.materias.findMany({
      where: { organizacionId }, // 👈 el hash también debe ser por organización
      select: { id: true, updated_at: true },
      orderBy: { updated_at: 'desc' },
    });

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(materias))
      .digest('hex');

    return { hash };
  }

  async findById(organizacionId: string, id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('El id proporcionado no es un UUID válido');
    }

    return this.prisma.materias.findFirst({
      where: { id, organizacionId }, // 👈 evita ver materias de otra organización
    });
  }

  async create(data: {
    nombre: string;
    carrera: string;
    data?: object;
    horas_semana: number;
    grado: number;
    salones?: object;
    organizacionId: string;
  }) {
    return this.prisma.materias.create({
      data,
    });
  }

  async update(
    organizacionId: string,
    id: string,
    data: Partial<{
      nombre: string;
      carrera: string;
      data?: object;
      grado: number;
      horas_semana: number;
      salones?: object;
    }>,
  ) {
    const materia = await this.prisma.materias.findFirst({ where: { id, organizacionId } });
    if (!materia) {
      throw new BadRequestException('Materia no encontrada en esta organización');
    }
    return this.prisma.materias.update({
      where: { id },
      data,
    });
  }

  async delete(organizacionId: string, id: string) {
    return this.prisma.materias.deleteMany({ where: { id, organizacionId } });
  }
}