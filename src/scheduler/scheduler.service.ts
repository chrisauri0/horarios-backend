// horario.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}





  async getSubjectsFormatted() {
  // 1️⃣ Ejecutar las RAW QUERIES
  const materiasProfesores = await this.prisma.$queryRaw<
    Array<{
      id: string;
      H: number;
      rooms: string[];
      profs: string;
      min_hora?: number;
    }>
  >`SELECT  
        m.nombre as id,
        m.horas_semana as H,
        m.salones as rooms,
        CONCAT(p.nombre, ' ', p.apellidos) AS profs,
        p.min_hora 
    FROM profesores p
    JOIN materias m ON p.materias @> to_jsonb(m.nombre)::jsonb;`;

  const grupos = await this.prisma.$queryRaw<
    Array<{ nombre: string }>
  >`SELECT g.nombre from grupos g;`;

  // 2️⃣ FORMAR JSON compatible con el microservicio Python
  const result = {};

  for (const g of grupos) {
    result[g.nombre] = materiasProfesores.map(item => ({
      id: item.id,
      H: item.H,
      rooms: Array.isArray(item.rooms) ? item.rooms : [item.rooms],
      profs: [item.profs],
      ...(item.min_hora ? { min_hora: item.min_hora } : {})
    }));
  }

  return result;
}


  async generateSchedule() {
const subjects = await this.getSubjectsFormatted();
  

    // 1️⃣ Llamar al microservicio Python
const response = await this.httpService.axiosRef.post(
  'https://python-back-horari-uteq.onrender.com/generar-horario',
  { subjects }
);

console.log('🧠 Respuesta Python:', response.data);

const result = response.data; // 👈 cambia esto
  
    if (!result || !Array.isArray(result.horario)) {
  throw new Error('No se recibieron asignaciones válidas del microservicio');
}

    // 3️⃣ Agrupar por grupo
    const gruposMap = new Map<string, any[]>();

    for (const item of result.horario) {
      const groupId = item.group;
      if (!gruposMap.has(groupId)) {
        gruposMap.set(groupId, []);
      }
      gruposMap.get(groupId)!.push(item);
    }

   // 4️⃣ Guardar cada grupo en la tabla `horarios`
for (const [groupName, assignments] of gruposMap.entries()) {
  const existing = await this.prisma.horarios.findFirst({
  where: { nombregrupo: groupName },
});

if (existing) {
  await this.prisma.horarios.update({
    where: { id: existing.id },
    data: { data: assignments },
  });
} else {
  await this.prisma.horarios.create({
    data: { nombregrupo: groupName, data: assignments },
  });
}

}


    // 5️⃣ Devolver una respuesta general
    return {
      message: 'Horarios generados y guardados por grupo correctamente',
      grupos: Array.from(gruposMap.keys()),
    };
  }

  async getAllSchedules() {
    return this.prisma.horarios.findMany();
  }
}
