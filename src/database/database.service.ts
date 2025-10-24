import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';

@Injectable()
export class DatabaseService   {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly sql;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definido');
    }

   
    this.sql = neon(databaseUrl);
    this.logger.log('Neon client inicializado');
  }
   async getData() {
        const data = await this.sql`...`;
        return data;
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
  
}
