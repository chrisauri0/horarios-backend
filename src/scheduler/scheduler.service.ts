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

  async generateSchedule() {
     this.prisma.grupos.findMany(),
     this.prisma.salones.findMany({
      select: { nombre: true }
     });
     this.prisma.materias.findMany();
     this.prisma.profesores.findMany();

    // 1️⃣ Llamar al microservicio Python
const response = await this.httpService.axiosRef.post(
  'http://localhost:5000/generar-horario',
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
