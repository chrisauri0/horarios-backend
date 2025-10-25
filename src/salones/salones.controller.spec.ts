import { Test, TestingModule } from '@nestjs/testing';
import { SalonesController } from './salones.controller';
import { SalonesService } from './salones.service';

describe('SalonesController', () => {
  let controller: SalonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonesController],
      providers: [SalonesService],
    }).compile();

    controller = module.get<SalonesController>(SalonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
