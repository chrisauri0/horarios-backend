import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class SalonesService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.salones.findMany();
    }

    async findById(id: number) {
        return this.prisma.salones.findUnique({
            where: { id },
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

    async update(id: number, data: Partial<{
        nombre_salon: string;
        nombre_edificio: string;
        data: object;
    }>) {
        return this.prisma.salones.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.salones.delete({
            where: { id },
        });
    }
}
