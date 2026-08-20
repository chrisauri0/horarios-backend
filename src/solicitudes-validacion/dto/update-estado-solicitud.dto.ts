import {
  IsIn,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  ValidateIf,
} from "class-validator";

export class UpdateEstadoSolicitudDto {
  @IsIn(["Aprobada", "Rechazada"])
  estado!: "Aprobada" | "Rechazada";

  @IsOptional()
  @IsString()
  observacionesAdmin?: string;

  // 👇 Los siguientes campos solo son obligatorios si estado === "Aprobada",
  // porque en ese caso se usan para crear el TDI en el catálogo.
  @ValidateIf((o) => o.estado === "Aprobada")
  @IsIn(["1", "2", "3", "4"])
  nivelDeImpacto?: string;

  @ValidateIf((o) => o.estado === "Aprobada")
  @IsInt()
  @Min(0)
  tdisPorGanar?: number;

  @ValidateIf((o) => o.estado === "Aprobada")
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @ValidateIf((o) => o.estado === "Aprobada")
  @IsDateString()
  fecha?: string;

  @ValidateIf((o) => o.estado === "Aprobada")
  @IsString()
  @IsNotEmpty()
  lugar!: string;

  @IsOptional()
  @IsString()
  emoji?: string;
}