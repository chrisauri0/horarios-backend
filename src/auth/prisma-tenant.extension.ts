// prisma-tenant.extension.ts
import { Prisma } from '@prisma/client';
export function withTenant(tenantId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async findMany({ args, query }) {
            args.where = { ...(args.where as any), organizacionId: tenantId };
            return query(args);
          },
          async findFirst({ args, query }) {
            args.where = { ...(args.where as any), organizacionId: tenantId };
            return query(args);
          },
          async create({ args, query }) {
            args.data = { ...(args.data as any), organizacionId: tenantId };
            return query(args);
          },
          async updateMany({ args, query }) {
            args.where = { ...(args.where as any), organizacionId: tenantId };
            return query(args);
          },
          async deleteMany({ args, query }) {
            args.where = { ...(args.where as any), organizacionId: tenantId };
            return query(args);
          },
        },
      },
    })
  );
}