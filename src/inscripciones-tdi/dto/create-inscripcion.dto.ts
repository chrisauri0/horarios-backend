import { IsString, IsNotEmpty } from "class-validator";

export class CreateInscripcionDto {
  @IsString()
  @IsNotEmpty()
  tdiId!: string;
}