import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.model';
import { GruposModule } from './grupos/grupos.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { SalonesModule } from './salones/salones.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
PrismaModule,
    DatabaseModule,

    // Módulo de usuarios
    UsersModule,

    GruposModule,

    ProfesoresModule,

    SalonesModule,

    HorariosModule,
  ],
})
export class AppModule {}
