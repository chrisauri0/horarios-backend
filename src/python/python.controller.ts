import { Controller, Get } from '@nestjs/common';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

  @Get('run')
  async runScript() {
    try {
      const output = await this.pythonService.runScript('src/scripts/cp_sat_schedule.py');
      const data = JSON.parse(output); // si tu script devuelve JSON
      console.log('Resultado Python:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error ejecutando Python:', error);
      return { success: false, error: error.message };
    }
  }
}
