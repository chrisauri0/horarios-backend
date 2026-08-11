// prisma-tenant.service.ts
import { Injectable } from '@nestjs/common';

import { withTenant } from './prisma-tenant.extension';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrismaTenantService {
  constructor(private readonly prisma: PrismaService) {}

  forTenant(tenantId: string) {
    return this.prisma.$extends(withTenant(tenantId));
  }
}