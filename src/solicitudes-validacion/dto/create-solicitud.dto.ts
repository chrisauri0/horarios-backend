import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  IsIn,
} from "class-validator";

const EJES_VALIDOS = [
  "Identidad Personal",
  "Entorno Social",
  "Entorno Físico",
  "Trascendencia",
];

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @IsString()
  @IsNotEmpty()
  nombreSolicitud!: string; // nombre de la actividad

  @IsIn(EJES_VALIDOS)
  eje!: string;

  // ── Contacto de la organización externa ──
  @IsString()
  @IsNotEmpty()
  personaEncargada!: string;

  @IsString()
  @IsNotEmpty()
  puesto!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsOptional()
  @IsString()
  extension?: string;

  @IsEmail()
  correo!: string; // correo del contacto externo, NO el del alumno

  @IsInt()
  @Min(1)
  horasRequeridas!: number;

  @IsString()
  @IsNotEmpty()
  competencias!: string;

  @IsString()
  @IsNotEmpty()
  evidencias!: string;

  @IsString()
  @IsNotEmpty()
  observaciones!: string;
}