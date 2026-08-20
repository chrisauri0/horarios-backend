import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { InscripcionesTdiController } from "./inscripciones-tdi.controller";
import { InscripcionesTdiService } from "./inscripciones-tdi.service";

@Module({
  controllers: [InscripcionesTdiController],
  providers: [InscripcionesTdiService, PrismaService],
})
export class InscripcionesTdiModule {}