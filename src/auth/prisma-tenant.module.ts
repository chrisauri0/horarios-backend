// prisma-tenant.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaTenantService } from './prisma-tenant.service';
import { PrismaModule } from '../../prisma/prisma.model'; 

@Global() // 👈 esto lo hace disponible en TODA la app sin reimportar
@Module({
  imports: [PrismaModule],
  providers: [PrismaTenantService],
  exports: [PrismaTenantService],
})
export class PrismaTenantModule {}