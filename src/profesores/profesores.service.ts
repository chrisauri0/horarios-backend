
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProfesoresService {
    constructor(private prisma: PrismaService) {}

    async findAllTutors() {
        console.log('→ Ejecutando findAllTutors');
        return this.prisma.profesores.findMany({
            where: { can_be_tutor: true },
        });
    }

    async findAll() {
        return this.prisma.profesores.findMany();
    }

    async findById(id: string) {
        console.log('→ Ejecutando findById con id:', id);
        return this.prisma.profesores.findUnique({
            where: { id },
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

    async update(id: string, data: Partial<{
        nombre: string;
        apellidos: string;
        email: string;
        can_be_tutor?: boolean;
        materias?: object;
        metadata?: object;
    }>) {
        return this.prisma.profesores.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.profesores.delete({
            where: { id },
        });
    }
}
