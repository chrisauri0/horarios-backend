import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class GruposService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.grupos.findMany();
    }

    async findById(grupo_id: string) {
        return this.prisma.grupos.findUnique({
            where: { grupo_id },
        });
    }

    async create(data: {
        name: string;
        tutor_id?: string;
        metadata?: object;
    }) {
        return this.prisma.grupos.create({
            data,
        });
    }

    async update(grupo_id: string, data: Partial<{
        name: string;
        tutor_id?: string;
        metadata?: object;
    }>) {
        return this.prisma.grupos.update({
            where: { grupo_id },
            data,
        });
    }

    async delete(grupo_id: string) {
        return this.prisma.grupos.delete({
            where: { grupo_id },
        });
    }
}
