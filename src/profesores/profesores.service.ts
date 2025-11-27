
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

async findAllMovil() {
  return this.prisma.profesores.findMany({
    select: {
        nombre: true,
        apellidos: true,
        email: true
      // agrega los campos que quieras devolver
    }
  });
}


    async findById(id: string) {
        console.log('→ Ejecutando findById con id:', id);
        return this.prisma.profesores.findUnique({
            where: { profesor_id: id },
        });
    }


    async create(data: {
        nombre: string;
        apellidos: string;
        email: string;
        can_be_tutor?: boolean;
        materias?: object;
        metadata?: object;
        min_hora: number;
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
        min_hora: number;
    }>) {
        return this.prisma.profesores.update({
            where: { profesor_id: id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.profesores.delete({
            where: { profesor_id: id },
        });
    }
}
