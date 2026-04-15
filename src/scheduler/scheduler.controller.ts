import { Controller, Post,Get, Body } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

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

  @Post('generate')
  async generateSchedule(@Body() body: GenerateSchedulePayload) {
    const result = await this.schedulerService.generateSchedule(body);
    return { result };
  }

  @Post('save')
  async saveSchedules(@Body() body: SaveSchedulesBody) {
    const result = await this.schedulerService.saveSchedules(body);
    return { result };
  }

  @Get('allschedules')
  async getAllSchedules() {
    const schedules = await this.schedulerService.getAllSchedules();
    return { schedules };
  }

  @Get('subjectsschedules')
  async getSubjectsSchedules() {
    const subjectsSchedules = await this.schedulerService.getSubjectsFormatted();
    return subjectsSchedules;
  }
}
