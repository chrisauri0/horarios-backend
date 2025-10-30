  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { PrismaService } from '../prisma/prisma.service';
  import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({ origin: 'http://localhost:4200' });


  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService);

  // Usar puerto de variable de entorno
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);
}
bootstrap();
