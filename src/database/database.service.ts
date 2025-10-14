import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly sql: ReturnType<typeof neon>;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definido');
    }

    // neon(databaseUrl) devuelve una función tag template para hacer queries
    this.sql = neon(databaseUrl);
    this.logger.log('Neon client inicializado');
  }

  // Ejemplo: obtener filas
  async query<T = any>(query: TemplateStringsArray, ...params: any[]): Promise<T[]> {
    const res = await (this.sql as any)(query, ...params); // el client es una función tag-template
    return res.rows ?? res;
  }

  // Utilidad simple para single-row
  async queryOne<T = any>(query: TemplateStringsArray, ...params: any[]): Promise<T | null> {
    const rows = await this.query<T>(query, ...params);
    return rows.length ? rows[0] : null;
  }

  // Si en algún caso necesitas cerrar (normalmente no necesario en serverless)
  async onModuleDestroy() {
    try {
      // Si el cliente ofreciera un close, lo ejecutaríamos aquí. Neon serverless no expone close en la versión típica.
      this.logger.log('DatabaseService destroy');
    } catch (err) {
      this.logger.error('Error on destroy DB', err as any);
    }
  }
}
