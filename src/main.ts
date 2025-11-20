import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: true,
  credentials: true,
});


  // Puerto dinámico (importante para Render)
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 App running on port ${port}`);
}
bootstrap();
