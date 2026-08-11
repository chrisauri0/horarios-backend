import { Injectable } from '@nestjs/common';



// carreras.service.ts
@Injectable()
export class CarrerasService {
  findAll(prisma: any) { // idealmente tipa esto con el tipo real del extended client
    return prisma.carreras.findMany();
  }

  findById(prisma: any, id: string) {
    return prisma.carreras.findFirst({ where: { id } }); // el extension ya agrega el organizacionId automático
  }

  findByNombre(prisma: any, nombre: string) {
    return prisma.carreras.findMany({ where: { nombre } });
  }

  create(prisma: any, dto: { nombre: string;   }, organizacionId: string) {
    return prisma.carreras.create({ data: { ...dto, organizacionId } }); // el extension también inyecta esto en create, pero pasarlo explícito no hace daño
  }

  update(prisma: any, id: string, dto: Partial<{ nombre: string;   }>) {
    return prisma.carreras.update({ where: { id }, data: dto });
  }

  delete(prisma: any, id: string) {
    return prisma.carreras.delete({ where: { id } });
  }
}
