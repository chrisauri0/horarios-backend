import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { SolicitudesValidacionController } from "./solicitudes-validacion.controller";
import { SolicitudesValidacionService } from "./solicitudes-validacion.service";

@Module({
  controllers: [SolicitudesValidacionController],
  providers: [SolicitudesValidacionService, PrismaService],
})
export class SolicitudesValidacionModule {}