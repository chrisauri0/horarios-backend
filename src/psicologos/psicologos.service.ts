import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PsicologosService {
  constructor(private prisma: PrismaService) {}

  async findAllByOrg(organizacionId: string) {
    return this.prisma.psicologos.findMany({
      where: { organizacionId },
    });
  }

  async findOne(organizacionId: string, id: string) {
    return this.prisma.psicologos.findFirst({
      where: { psicologo_id: id, organizacionId },
    });
  }

  async create(data: {
    nombre: string;
    apellidos: string;
    email: string;
    disponibilidad: object;
    organizacionId: string;
  }) {
    return this.prisma.psicologos.create({
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
      disponibilidad: object;
    }>,
  ) {
    const psicologo = await this.prisma.psicologos.findFirst({
      where: { psicologo_id: id, organizacionId },
    });
    if (!psicologo) {
      throw new BadRequestException('Psicólogo no encontrado en esta organización');
    }
    return this.prisma.psicologos.update({
      where: { psicologo_id: id },
      data,
    });
  }

  async delete(organizacionId: string, id: string) {
    return this.prisma.psicologos.deleteMany({ where: { psicologo_id: id, organizacionId } });
  }
}