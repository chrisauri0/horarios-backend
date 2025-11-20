import { Controller, Post,Get, Body } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('generate')
  async generateSchedule(@Body() body: any) {
    const result = await this.schedulerService.generateSchedule();
    return { result };
  } 
  @Get('allschedules')
  async getAllSchedules() {
    const schedules = await this.schedulerService.getAllSchedules();
    return { schedules }; 
  }
}
