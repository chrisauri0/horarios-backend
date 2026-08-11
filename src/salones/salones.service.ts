import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SalonesService {
  constructor(private prisma: PrismaService) {}

  async findAllByOrg(organizacionId: string) {
    return this.prisma.salones.findMany({ where: { organizacionId } });
  }

  async findById(organizacionId: string, id: string) {
    return this.prisma.salones.findFirst({
      where: { id, organizacionId }, // 👈 evita que veas/edites salones de otra organización aunque adivines el id
    });
  }

  async findByNombreYEdificio(organizacionId: string, nombre: string) {
    return this.prisma.salones.findFirst({
      where: { nombre, organizacionId }, // 👈 el nombre único ahora es único POR organización, no global
    });
  }

  async create(data: {
    nombre: string;
    data?: object;
    organizacionId: string;
  }) {
    return this.prisma.salones.create({
      data: {
        nombre: data.nombre,
        data: data.data ?? {},
        organizacionId: data.organizacionId,
      },
    });
  }

  async update(
    organizacionId: string,
    id: string,
    data: Partial<{ nombre: string; data: object }>,
  ) {
    // Verifica primero que el salón pertenezca a esta organización antes de editar
    const salon = await this.prisma.salones.findFirst({ where: { id, organizacionId } });
    if (!salon) {
      throw new Error('Salón no encontrado en esta organización');
    }
    return this.prisma.salones.update({
      where: { id },
      data,
    });
  }

  async delete(organizacionId: string, id: string) {
    // deleteMany con ambos filtros: si no pertenece a la organización, no borra nada
    return this.prisma.salones.deleteMany({ where: { id, organizacionId } });
  }
}