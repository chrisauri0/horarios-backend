// horario.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Prisma } from '@prisma/client';

type GenerateSchedulePayload = {
  grupos: unknown[];
  profesores: unknown[];
  salones: unknown[];
  division: string;
  turno: string;
};

type ScheduleEntry = {
  grupo?: string;
  group?: string;
  [key: string]: unknown;
};

type SaveSchedulesPayload = {
  horario: ScheduleEntry[];
};

@Injectable()
export class SchedulerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private async persistSchedulesByGroup(
    horario: ScheduleEntry[],
    organizacionId: string, // 👈 nuevo parámetro
  ) {
    const gruposMap = new Map<string, ScheduleEntry[]>();

    for (const [idx, item] of horario.entries()) {
      const rawGroup = typeof item.grupo === 'string' ? item.grupo : item.group;

      if (!rawGroup || typeof rawGroup !== 'string') {
        throw new BadRequestException(
          `La entrada en horario[${idx}] no contiene un grupo valido (grupo o group)`,
        );
      }

      const groupName = rawGroup.trim();
      if (!groupName) {
        throw new BadRequestException(
          `La entrada en horario[${idx}] contiene un grupo vacio`,
        );
      }

      if (!gruposMap.has(groupName)) {
        gruposMap.set(groupName, []);
      }
      gruposMap.get(groupName)!.push(item);
    }

    for (const [groupName, assignments] of gruposMap.entries()) {
      // 👇 filtramos también por organizacionId para no pisar horarios de otra organización con el mismo nombre de grupo
      const existing = await this.prisma.horarios.findFirst({
        where: { nombregrupo: groupName, organizacionId },
      });

      if (existing) {
        await this.prisma.horarios.update({
          where: { id: existing.id },
          data: { data: assignments as Prisma.InputJsonValue },
        });
      } else {
        await this.prisma.horarios.create({
          data: {
            nombregrupo: groupName,
            data: assignments as Prisma.InputJsonValue,
            organizacionId, // 👈 viene del parámetro, ya no del JSON
          },
        });
      }
    }

    return {
      grupos: Array.from(gruposMap.keys()),
      totalAsignaciones: horario.length,
    };
  }

  async getSubjectsFormatted() {
    // ... (sin cambios, aunque nota que esto también debería filtrar por organizacionId
    //      si vas a tener varias organizaciones con materias/profesores/grupos distintos)
    const materiasProfesores = await this.prisma.$queryRaw<
      Array<{
        id: string;
        h: number;
        rooms: string[] | string;
        profs: string;
        min_hora?: number | null;
      }>
    >`
      SELECT  
          m.nombre AS id,
          m.horas_semana AS h,
          m.salones AS rooms,
          CONCAT(p.nombre, ' ', p.apellidos) AS profs,
        
      FROM profesores p
      JOIN materias m 
          ON p.materias @> to_jsonb(m.nombre)::jsonb;
    `;

    const grupos = await this.prisma.$queryRaw<Array<{ nombre: string }>>`
      SELECT nombre FROM grupos;
    `;

    const materiasMap = new Map<string, string[]>();

    for (const item of materiasProfesores) {
      const matName = item.id.trim();
      if (!materiasMap.has(matName)) materiasMap.set(matName, []);
      materiasMap.get(matName)!.push(item.profs);
    }

    const result: Record<string, any[]> = {};

    grupos.forEach((g, groupIdx) => {
      const cleanName = g.nombre.replace(/\s+/g, "");
      result[cleanName] = [];

      materiasMap.forEach((profsList, matName) => {
        const assignedProf = profsList[groupIdx % profsList.length];
        const matData = materiasProfesores.find(m => m.id.trim() === matName)!;

        result[cleanName].push({
          id: matName,
          H: matData.h,
          rooms: Array.isArray(matData.rooms) ? matData.rooms : [matData.rooms],
          profs: [assignedProf],
          ...(matData.min_hora ? { min_hora: matData.min_hora } : {})
        });
      });
    });

    console.log("📦 JSON final enviado a Python:", JSON.stringify(result, null, 2));
    return result;
  }

  async generateSchedule(payload: GenerateSchedulePayload, organizacionId: string) {
    const response = await this.httpService.axiosRef.post(
      'http://localhost:8000/generar-horario',
      payload,
    );

    console.log('🧠 Respuesta Python:', response.data);

    const result = response.data;

    if (!result || !Array.isArray(result.horario)) {
      throw new Error('No se recibieron asignaciones válidas del microservicio');
    }

    const persisted = await this.persistSchedulesByGroup(result.horario, organizacionId);

    return {
      message: 'Horarios generados y guardados por grupo correctamente',
      grupos: persisted.grupos,
      totalAsignaciones: persisted.totalAsignaciones,
    };
  }

  async saveSchedules(
    payload: SaveSchedulesPayload | ScheduleEntry[],
    organizacionId: string,
  ) {
    const horario = Array.isArray(payload)
      ? payload
      : payload && Array.isArray(payload.horario)
        ? payload.horario
        : null;

    if (!horario) {
      throw new BadRequestException(
        'El payload debe ser un arreglo o tener la propiedad horario como arreglo',
      );
    }

    const persisted = await this.persistSchedulesByGroup(horario, organizacionId);

    return {
      message: 'Horarios guardados correctamente',
      grupos: persisted.grupos,
      totalAsignaciones: persisted.totalAsignaciones,
    };
  }

  async getAllSchedules(organizacionId: string) {
    // 👇 importante: sin este filtro, cualquier usuario ve TODOS los horarios de TODAS las organizaciones
    return this.prisma.horarios.findMany({ where: { organizacionId } });
  }

  async updateSchedule(id: string, data: { nombregrupo?: string; data?: object }) {
    return this.prisma.horarios.update({
      where: { id },
      data,
    });
  }
}