import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class SalonesService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.salones.findMany();
    }

    async findById(id: string) {
        return this.prisma.salones.findUnique({
            where: { id },
        });
    }
    async findByNombreYEdificio(nombre_salon: string, nombre_edificio: string) {
  return this.prisma.salones.findFirst({
    where: { nombre_salon, nombre_edificio }
  });
}

    async create(data: {
        nombre_salon: string;
        nombre_edificio: string;
        data: object;
    }) {
        return this.prisma.salones.create({
            data,
        });
    }

    async update(id: string, data: Partial<{
        nombre_salon: string;
        nombre_edificio: string;
        data: object;
    }>) {
        return this.prisma.salones.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.salones.delete({
            where: { id },
        });
    }
}
