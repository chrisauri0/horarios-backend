import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TdisService } from "./tdis.service";
import { CreateTdiDto } from "./dto/create-tdi.dto";

@Controller("tdis")
export class TdisController {
  constructor(private readonly tdisService: TdisService) {}

  @Get() findAll() { return this.tdisService.findAll(); }

  @Post() create(@Body() dto: CreateTdiDto) { return this.tdisService.create(dto); }

  @Patch(":id") update(@Param("id") id: string, @Body() dto: CreateTdiDto) {
    return this.tdisService.update(id, dto);
  }

  @Delete(":id") remove(@Param("id") id: string) { return this.tdisService.remove(id); }
}