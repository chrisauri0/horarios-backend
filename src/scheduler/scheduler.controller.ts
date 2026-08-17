import { Controller, Post, Get, Req, Body, UseGuards } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AuthGuard } from '@nestjs/passport';

type GenerateSchedulePayload = {
  grupos: unknown[];
  profesores: unknown[];
  salones: unknown[];
  division: string;
  turno: string;
};

type SaveSchedulesPayload = {
  horario: Array<Record<string, unknown>>;
};

type SaveSchedulesBody = SaveSchedulesPayload | Array<Record<string, unknown>>;

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('generar')
  generateSchedule(@Req() req: any, @Body() payload: GenerateSchedulePayload) {
    return this.schedulerService.generateSchedule(payload, req.user.organizacionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('guardar')
  saveSchedules(@Req() req: any, @Body() payload: SaveSchedulesPayload) {
    return this.schedulerService.saveSchedules(payload, req.user.organizacionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllSchedules(@Req() req: any) {
    return this.schedulerService.getAllSchedules(req.user.organizacionId);
  }

  @Get('subjectsschedules')
  async getSubjectsSchedules() {
    const subjectsSchedules = await this.schedulerService.getSubjectsFormatted();
    return subjectsSchedules;
  }
}