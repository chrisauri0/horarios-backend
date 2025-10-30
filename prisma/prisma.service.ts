import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Llamar desde main.ts para cerrar correctamente Nest cuando Prisma detecte beforeExit.
   * Uso: await prismaService.enableShutdownHooks(app)
   */
  
}
