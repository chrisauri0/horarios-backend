    import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class SubirEvidenciaDto {
  @IsOptional()
  @IsUrl()
  evidenciaUrl?: string;

  @IsString()
  @IsNotEmpty()
  nota!: string;
}