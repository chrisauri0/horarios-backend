// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear la organización UTEQ
  const org = await prisma.organizacion.create({
    data: { nombre: 'UTEQ' },
  });

  console.log('Organización creada:', org);

  // 2. Crear el usuario admin dentro de esa organización
  const hashedPassword = await bcrypt.hash('CAMBIA_ESTA_PASSWORD', 10);

  const admin = await prisma.users.create({
    data: {
      email: 'admin@uteq.edu.mx',
      password_hash: hashedPassword,
      full_name: 'Administrador UTEQ',
      role: 'administrador',
      organizacionId: org.id,
    },
  });

  console.log('Admin creado:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });