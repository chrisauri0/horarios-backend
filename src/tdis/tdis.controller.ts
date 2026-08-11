import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { TdisService } from "./tdis.service";
import { CreateTdiDto } from "./dto/create-tdi.dto";

@UseGuards(AuthGuard('jwt')) // 👈 faltaba
@Controller("tdis")
export class TdisController {
  constructor(private readonly tdisService: TdisService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tdisService.findAll(req.user.organizacionId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTdiDto) {
    return this.tdisService.create(dto, req.user.organizacionId);
  }

  @Patch(':id') // 👈 faltaba
  update(@Req() req: any, @Param('id') id: string, @Body() dto: CreateTdiDto) { // 👈 faltaba @Param y @Body
    return this.tdisService.update(id, dto, req.user.organizacionId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tdisService.remove(id, req.user.organizacionId);
  }
}