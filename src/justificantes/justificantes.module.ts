import { Module } from "@nestjs/common";
import { JustificantesController } from "./justificantes.controller";
import { JustificantesService } from "./justificantes.service";

@Module({
  controllers: [JustificantesController],
  providers: [JustificantesService],
})
export class JustificantesModule {}