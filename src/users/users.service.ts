import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findAllByOrg(organizacionId: string) {
    return this.prisma.users.findMany({ where: { organizacionId } });
  }

  async findByUsername(full_name: string) {
    return this.prisma.users.findMany({
      where: { full_name },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findByOrganizacionId(id: string) {
    return this.prisma.organizacion.findUnique({
      where: {  id },
    });
  }

  async findSinOrganizacion() {
    return this.prisma.users.findMany({
      where: { organizacionId: '' },
    });
  }

  async organizacionExiste(nombre: string) {
    return this.prisma.organizacion.findUnique({ where: { nombre } });
  }

  async crearOrganizacionConAdmin(data: {
    nombreOrganizacion: string;
    email: string;
    passwordHash: string;
    fullName?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const organizacion = await tx.organizacion.create({
        data: { nombre: data.nombreOrganizacion },
      });

      const admin = await tx.users.create({
        data: {
          email: data.email,
          password_hash: data.passwordHash,
          full_name: data.fullName,
          role: 'administrador',
          organizacionId: organizacion.id,
        },
      });

      return { organizacion, admin };
    });
  }

  async create(data: {
    email: string;
    passwordHash?: string;              
    fullName?: string;
    role?: string;
    metadata?: object;
    organizacionId?: string;            
    authProvider?: string;              
  }) {
    return this.prisma.users.create({
      data: {
        email: data.email,
        password_hash: data.passwordHash,
        full_name: data.fullName,
        role: data.role,
        metadata: data.metadata,
        organizacionId: data.organizacionId,
        authProvider: data.authProvider ?? 'local',
      },
    });
  }

  async update(id: string, data: Partial<{
    email: string;
    passwordHash: string;
    fullName?: string;
    role?: string;
    metadata?: object;
    organizacionId?: string;
  }>) {
    return this.prisma.users.update({
      where: { id },
      data: {
        email: data.email,
        password_hash: data.passwordHash,
        full_name: data.fullName,
        role: data.role,
        metadata: data.metadata,
        organizacionId: data.organizacionId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}