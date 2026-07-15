import { IsEnum, IsOptional, IsString } from "class-validator";
import { EstadoJustificante } from "@prisma/client";

export class UpdateEstadoDto {
  @IsEnum(EstadoJustificante)
  estado!: EstadoJustificante;

  @IsOptional()
  @IsString()
  comentarioAdmin?: string;
}