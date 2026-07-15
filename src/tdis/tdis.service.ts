import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { PrismaService } from 'prisma/prisma.service';

import { CreateTdiDto } from "./dto/create-tdi.dto";

@Injectable()
export class TdisService {
  constructor(private prisma: PrismaService) {}

  private toDb(dto: CreateTdiDto) {
    return {
      eje: dto.eje,
      nombre: dto.nombre,
      persona_encargada: dto.personaEncargada,
      puesto: dto.puesto,
      telefono: dto.telefono,
      extension: dto.extension ?? "",
      correo: dto.correo,
      tipo: dto.tipo,
      horas_requeridas: dto.horasRequeridas,
      nivel_de_impacto: dto.nivelDeImpacto,
      tdis_por_ganar: dto.tdisPorGanar,
      activo: dto.activo ?? true,
      competencias: dto.competencias,
      evidencias: dto.evidencias,
      observaciones: dto.observaciones,
    };
  }

  findAll() {
    return this.prisma.tdis.findMany({ orderBy: { created_at: "desc" } });
  }

  async create(dto: CreateTdiDto) {
    const existe = await this.prisma.tdis.findFirst({ where: { eje: dto.eje } });
    if (existe) throw new ConflictException("Ya existe un registro con ese eje");
    return this.prisma.tdis.create({ data: this.toDb(dto) });
  }

  async update(id: string, dto: CreateTdiDto) {
    const tdi = await this.prisma.tdis.findUnique({ where: { id } });
    if (!tdi) throw new NotFoundException("TDI no encontrado");
    return this.prisma.tdis.update({ where: { id }, data: this.toDb(dto) });
  }

  remove(id: string) {
    return this.prisma.tdis.delete({ where: { id } });
  }
}