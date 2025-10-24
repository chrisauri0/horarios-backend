import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
PrismaModule,
    DatabaseModule,

    // Módulo de usuarios
    UsersModule,
  ],
})
export class AppModule {}
