import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

  @Get('run')
  @UseGuards(AuthGuard('jwt')) // 👈 necesario para que req.user exista
  async runScript(@Req() req: any) { // 👈 faltaba declarar req aquí
    try {
      const organizacionId = req.user.organizacionId;
      const data = await this.pythonService.runScript();
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
        await this.pythonService.create(
          {
            nombregrupo,
            data: entries,
          },
          organizacionId, // 👈 ahora sí está definido
        );
      }

      return { success: true, grupos };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error ejecutando Python:', message);
      return { success: false, error: message };
    }
  }
}