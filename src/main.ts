  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { PrismaService } from '../prisma/prisma.service';
  import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para desarrollo (acepta peticiones desde cualquier origen)
  // En producción, deberías especificar los orígenes permitidos
  app.enableCors({ 
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService);

  // Usar puerto de variable de entorno
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);
}
bootstrap();
