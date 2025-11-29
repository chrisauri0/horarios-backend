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
  // 1️⃣ Obtener materias + profesores
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
        p.min_hora
    FROM profesores p
    JOIN materias m 
        ON p.materias @> to_jsonb(m.nombre)::jsonb;
  `;

  // 2️⃣ Obtener grupos existentes
  const grupos = await this.prisma.$queryRaw<Array<{ nombre: string }>>`
    SELECT nombre FROM grupos;
  `;

  // 3️⃣ Agrupar materias → lista de profesores por materia
  const materiasMap = new Map<string, string[]>();

  for (const item of materiasProfesores) {
    const matName = item.id.trim();
    if (!materiasMap.has(matName)) materiasMap.set(matName, []);
    materiasMap.get(matName)!.push(item.profs);
  }

  // 4️⃣ Construir JSON final por grupo
  const result: Record<string, any[]> = {};

  grupos.forEach((g, groupIdx) => {
    const cleanName = g.nombre.replace(/\s+/g, ""); // IDGS15 → IDGS15
    result[cleanName] = [];

    materiasMap.forEach((profsList, matName) => {
      const assignedProf = profsList[groupIdx % profsList.length]; // rotación

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

  async generateSchedule() {  
// const subjects = await this.getSubjectsFormatted();

// console.log("📦 JSON enviado a Python:", JSON.stringify(subjects, null, 2));

  

    // 1️⃣ Llamar al microservicio Python
const response = await this.httpService.axiosRef.post(
  'https://python-back-horari-uteq.onrender.com/generar-horario',
  // 'http://localhost:5000/generar-horario',
  //  subjects 
);

console.log('🧠 Respuesta Python:', response.data);

const result = response.data; 
  
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
