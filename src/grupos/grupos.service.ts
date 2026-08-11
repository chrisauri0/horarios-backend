import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GruposService {
  constructor(private prisma: PrismaService) {}

  async findAllByOrg(organizacionId: string) {
    return this.prisma.grupos.findMany({ where: { organizacionId } });
  }

  async findById(organizacionId: string, id: string) {
    return this.prisma.grupos.findFirst({
      where: { id, organizacionId },
    });
  }

  async create(data: {
    nombre: string;
    carrera: string;
    data?: object;
    grado: number;
    organizacionId: string;
  }) {
    return this.prisma.grupos.create({
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
    }>,
  ) {
    const grupo = await this.prisma.grupos.findFirst({ where: { id, organizacionId } });
    if (!grupo) {
      throw new BadRequestException('Grupo no encontrado en esta organización');
    }
    return this.prisma.grupos.update({
      where: { id },
      data,
    });
  }

  async delete(organizacionId: string, id: string) {
    return this.prisma.grupos.deleteMany({ where: { id, organizacionId } });
  }
}