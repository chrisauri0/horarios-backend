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

  findAll(organizacionId: string) {
    return this.prisma.tdis.findMany({
      where: { organizacionId }, // 👈 filtra por organización
      orderBy: { created_at: "desc" },
    });
  }

  async create(dto: CreateTdiDto, organizacionId: string) {
    const existe = await this.prisma.tdis.findFirst({
      where: { eje: dto.eje, organizacionId }, // 👈 el eje único debe ser único POR organización, no global
    });
    if (existe) throw new ConflictException("Ya existe un registro con ese eje");

    return this.prisma.tdis.create({
      data: { ...this.toDb(dto), organizacionId }, // 👈 aquí estaba el bug, ya va dentro de data
    });
  }

  async update(id: string, dto: CreateTdiDto, organizacionId: string) {
    const tdi = await this.prisma.tdis.findFirst({
      where: { id, organizacionId }, // 👈 evita que edites un TDI de otra organización aunque adivines el id
    });
    if (!tdi) throw new NotFoundException("TDI no encontrado");
    return this.prisma.tdis.update({ where: { id }, data: this.toDb(dto) });
  }

  remove(id: string, organizacionId: string) {
    // 👇 mismo cuidado: valida que pertenezca a la organización antes de borrar
    return this.prisma.tdis.deleteMany({ where: { id, organizacionId } });
  }
}