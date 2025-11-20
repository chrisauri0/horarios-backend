import { Module } from '@nestjs/common';
import { PythonService } from './python.service';

import { HttpModule } from '@nestjs/axios';
import { PythonController } from './python.controller';

@Module({
  imports: [HttpModule],
  controllers: [PythonController],
  providers: [PythonService],
})
export class PythonModule {}