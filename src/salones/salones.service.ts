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
    async findByNombreYEdificio(nombre: string) {
  return this.prisma.salones.findFirst({
    where: { nombre }
  });
}

    async create(data: {
        nombre: string;
        data: object;
        division: string;
    }) {
        return this.prisma.salones.create({
            data,
        });
    }

    async update(id: string, data: Partial<{
        nombre: string;
        data: object;
        division: string;
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
