import { Controller, Get } from '@nestjs/common';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

  @Get('run')
  async runScript() {
    try {
      const data = await this.pythonService.runScript(); // <- data ya contiene el horario
      console.log('Resultado Python:', data);

      // 1️⃣ Agrupar por grupo
      const grupos = data.horario.reduce((acc, entry) => {
        const { group, ...rest } = entry;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(rest);
        return acc;
      }, {} as Record<string, any[]>);

      // 2️⃣ Guardar una sola fila por grupo
      for (const [nombregrupo, entries] of Object.entries(grupos)) {
        await this.pythonService.create({
          nombregrupo,
          data: entries, // 👈 aquí va el array de materias
        });
      }

      return { success: true, grupos };
    } catch (error) {
      console.error('Error ejecutando Python:', error);
      return { success: false, error: error.message };
    }
  }
}
