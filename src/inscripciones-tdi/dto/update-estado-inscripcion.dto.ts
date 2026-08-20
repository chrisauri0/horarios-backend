import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateEstadoInscripcionDto {
  @IsIn(["en_revision", "aprobado", "rechazado"])
  estado!: "en_revision" | "aprobado" | "rechazado";

  @IsOptional()
  @IsString()
  comentarioAdmin?: string;
}