import { IsDateString, IsString, IsUrl, IsNotEmpty } from "class-validator";

export class CreateJustificanteDto {
  @IsUrl()
  @IsNotEmpty()
  driveUrl!: string ;

  @IsString()
  @IsNotEmpty()
  motivo!: string ;

  @IsDateString()
  fecha!: string ;
}