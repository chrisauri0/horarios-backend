import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CarrerasService } from './carreras.service';
import { PrismaTenantService } from '../auth/prisma-tenant.service';

@Controller('carreras')
@UseGuards(AuthGuard('jwt')) 

export class CarrerasController {
  constructor(
    private readonly carrerasService: CarrerasService,
    private readonly prismaTenant: PrismaTenantService,
  ) {}

  @Get()
  findAll(@Req() req: any) {
    const tenantPrisma = this.prismaTenant.forTenant(req.user.organizacionId); // 👈 organizacionId, no areaId
    return this.carrerasService.findAll(tenantPrisma);
  }

  @Get(':id')
  findById(@Req() req: any, @Param('id') id: string) {
    const tenantPrisma = this.prismaTenant.forTenant(req.user.organizacionId);
    return this.carrerasService.findById(tenantPrisma, id); // 👈 ahora también scopeado por tenant
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() createCarreraDto: { nombre: string;   },
    
  ) {
    const tenantPrisma = this.prismaTenant.forTenant(req.user.organizacionId);

    const existentes = await this.carrerasService.findByNombre(tenantPrisma, createCarreraDto.nombre);
    if (existentes && existentes.length > 0) {
      return { error: 'Ya existe una carrera con ese nombre.' };
    }
    return this.carrerasService.create(tenantPrisma, createCarreraDto, req.user.organizacionId);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCarreraDto: Partial<{ nombre: string;  }>,
  ) {
    const tenantPrisma = this.prismaTenant.forTenant(req.user.organizacionId);
    return this.carrerasService.update(tenantPrisma, id, updateCarreraDto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    const tenantPrisma = this.prismaTenant.forTenant(req.user.organizacionId);
    return this.carrerasService.delete(tenantPrisma, id);
  }
}