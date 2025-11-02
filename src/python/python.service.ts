import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);
  private readonly PYTHON_BIN = process.env.PYTHON_BIN || 'python3'; 
  runScript(scriptRelativePath: string, args: string[] = [],input?: string,  timeoutMs = 30_000): Promise<string>{
    const scriptPath = join(process.cwd(), scriptRelativePath);
    this.logger.debug(`Running python: ${this.PYTHON_BIN} ${scriptPath} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
      const child = spawn(this.PYTHON_BIN, [scriptPath, ...args], { stdio: ['pipe', 'pipe', 'pipe'] });

      let stdout = '';
      let stderr = '';

      const timeout = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Python script timeout (${timeoutMs}ms)`));
      }, timeoutMs);

      child.stdout.on('data', (data) => { stdout += data.toString(); });
      child.stderr.on('data', (data) => { stderr += data.toString(); });

      child.on('error', (err) => {
        clearTimeout(timeout);
        this.logger.error('Failed to spawn python process', err);
        reject(err);
      });

      child.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          const e = new Error(`Python exited with code ${code}: ${stderr}`);
          this.logger.error(e.message);
          reject(e);
        }
      });
    });
  }
}
