import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
import { IsDateString, Min } from "class-validator";

export class CreateTdiDto {
  @IsString() eje!: string;
  @IsString() nombre!: string;
  @IsString() personaEncargada!: string;
  @IsString() puesto!: string;
  @IsString() telefono!: string;
  @IsOptional() @IsString() extension?: string;
  @IsString() correo!: string;
  @IsString() tipo!: string;
  @IsInt() horasRequeridas!: number;
  @IsString() nivelDeImpacto!: string;
  @IsInt() tdisPorGanar!: number;
  @IsOptional() @IsBoolean() activo?: boolean;
  @IsString() competencias!: string;
  @IsString() evidencias!: string;
  @IsString() observaciones!: string;
   @IsOptional() @IsInt() @Min(1) cupoMaximo?: number;
  @IsOptional() @IsDateString() fecha?: string;
  @IsOptional() @IsString() lugar?: string;
  @IsOptional() @IsString() emoji?: string;
}