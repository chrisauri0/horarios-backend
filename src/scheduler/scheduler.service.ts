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
    organizacionId: string,
  ) {
    console.log('🔵 [persistSchedulesByGroup] Iniciando con', horario.length, 'entradas, organizacionId:', organizacionId);

    const gruposMap = new Map<string, ScheduleEntry[]>();

    for (const [idx, item] of horario.entries()) {
      const rawGroup = typeof item.grupo === 'string' ? item.grupo : item.group;

      if (!rawGroup || typeof rawGroup !== 'string') {
        console.error(`🔴 [persistSchedulesByGroup] Entrada horario[${idx}] sin grupo válido:`, item);
        throw new BadRequestException(
          `La entrada en horario[${idx}] no contiene un grupo valido (grupo o group)`,
        );
      }

      const groupName = rawGroup.trim();
      if (!groupName) {
        console.error(`🔴 [persistSchedulesByGroup] Entrada horario[${idx}] con grupo vacío:`, item);
        throw new BadRequestException(
          `La entrada en horario[${idx}] contiene un grupo vacio`,
        );
      }

      if (!gruposMap.has(groupName)) {
        gruposMap.set(groupName, []);
      }
      gruposMap.get(groupName)!.push(item);
    }

    console.log('🔵 [persistSchedulesByGroup] Grupos detectados:', Array.from(gruposMap.keys()));

    for (const [groupName, assignments] of gruposMap.entries()) {
      try {
        const existing = await this.prisma.horarios.findFirst({
          where: { nombregrupo: groupName, organizacionId },
        });

        if (existing) {
          console.log(`🟡 [persistSchedulesByGroup] Actualizando grupo existente "${groupName}" (id: ${existing.id})`);
          await this.prisma.horarios.update({
            where: { id: existing.id },
            data: { data: assignments as Prisma.InputJsonValue },
          });
        } else {
          console.log(`🟢 [persistSchedulesByGroup] Creando nuevo grupo "${groupName}"`);
          await this.prisma.horarios.create({
            data: {
              nombregrupo: groupName,
              data: assignments as Prisma.InputJsonValue,
              organizacionId,
            },
          });
        }
      } catch (err) {
        console.error(`🔴 [persistSchedulesByGroup] Error guardando grupo "${groupName}":`, err);
        throw err;
      }
    }

    console.log('✅ [persistSchedulesByGroup] Completado. Total asignaciones:', horario.length);

    return {
      grupos: Array.from(gruposMap.keys()),
      totalAsignaciones: horario.length,
    };
  }

  async getSubjectsFormatted() {
    console.log('🔵 [getSubjectsFormatted] Consultando materias/profesores/grupos...');

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
          CONCAT(p.nombre, ' ', p.apellidos) AS profs
        
      FROM profesores p
      JOIN materias m 
          ON p.materias @> to_jsonb(m.nombre)::jsonb;
    `;

    console.log('🔵 [getSubjectsFormatted] materiasProfesores encontrados:', materiasProfesores.length);

    const grupos = await this.prisma.$queryRaw<Array<{ nombre: string }>>`
      SELECT nombre FROM grupos;
    `;

    console.log('🔵 [getSubjectsFormatted] grupos encontrados:', grupos.length);

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

    console.log("📦 [getSubjectsFormatted] JSON final enviado a Python:", JSON.stringify(result, null, 2));
    return result;
  }

  async generateSchedule(payload: GenerateSchedulePayload, organizacionId: string) {
    console.log('🔵 [generateSchedule] Payload recibido:', JSON.stringify(payload, null, 2));
    console.log('🔵 [generateSchedule] organizacionId:', organizacionId);

    let response;
    try {
      response = await this.httpService.axiosRef.post(
        'https://ortools-horarios.onrender.com:8000/generar-horario',
        payload,
      );
    } catch (err: any) {
      console.error('🔴 [generateSchedule] Error llamando al microservicio Python:', err?.response?.data || err?.message);
      throw err;
    }

    console.log('🧠 [generateSchedule] Respuesta Python status:', response.status);
    console.log('🧠 [generateSchedule] Respuesta Python data:', JSON.stringify(response.data, null, 2));

    const result = response.data;

    if (!result || !Array.isArray(result.horario)) {
      console.error('🔴 [generateSchedule] La respuesta de Python no trae un array "horario" válido:', result);
      throw new Error('No se recibieron asignaciones válidas del microservicio');
    }

    const persisted = await this.persistSchedulesByGroup(result.horario, organizacionId);

    console.log('✅ [generateSchedule] Guardado exitoso:', persisted);

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
    console.log('🔵 [saveSchedules] Payload recibido:', JSON.stringify(payload, null, 2));
    console.log('🔵 [saveSchedules] organizacionId:', organizacionId);

    const horario = Array.isArray(payload)
      ? payload
      : payload && Array.isArray(payload.horario)
        ? payload.horario
        : null;

    if (!horario) {
      console.error('🔴 [saveSchedules] Payload inválido, no es array ni tiene .horario:', payload);
      throw new BadRequestException(
        'El payload debe ser un arreglo o tener la propiedad horario como arreglo',
      );
    }

    const persisted = await this.persistSchedulesByGroup(horario, organizacionId);

    console.log('✅ [saveSchedules] Guardado exitoso:', persisted);

    return {
      message: 'Horarios guardados correctamente',
      grupos: persisted.grupos,
      totalAsignaciones: persisted.totalAsignaciones,
    };
  }

  async getAllSchedules(organizacionId: string) {
    console.log('🔵 [getAllSchedules] Buscando horarios para organizacionId:', organizacionId);
    const result = await this.prisma.horarios.findMany({ where: { organizacionId } });
    console.log('🔵 [getAllSchedules] Encontrados:', result.length, 'horarios');
    return result;
  }

  async updateSchedule(id: string, data: { nombregrupo?: string; data?: object }) {
    console.log('🔵 [updateSchedule] id:', id, 'data:', JSON.stringify(data, null, 2));
    const result = await this.prisma.horarios.update({
      where: { id },
      data,
    });
    console.log('✅ [updateSchedule] Actualizado:', result.id);
    return result;
  }
}