import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Carga variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true, // hace que ConfigService esté disponible en toda la app
    }),

    // Módulo de conexión Neon
    DatabaseModule,

    // Módulo de usuarios
    UsersModule,
  ],
})
export class AppModule {}
