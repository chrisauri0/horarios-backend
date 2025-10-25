import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class ProfesoresService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.profesores.findMany();
    }

    async findById(profesor_id: string) {
        return this.prisma.profesores.findUnique({
            where: { profesor_id },
        });
    }

    async create(data: {
        nombre: string;
        apellidos: string;
        email: string;
        can_be_tutor?: boolean;
        materias?: object;
        metadata?: object;
    }) {
        return this.prisma.profesores.create({
            data,
        });
    }

    async update(profesor_id: string, data: Partial<{
        nombre: string;
        apellidos: string;
        email: string;
        can_be_tutor?: boolean;
        materias?: object;
        metadata?: object;
    }>) {
        return this.prisma.profesores.update({
            where: { profesor_id },
            data,
        });
    }

    async delete(profesor_id: string) {
        return this.prisma.profesores.delete({
            where: { profesor_id },
        });
    }
}
