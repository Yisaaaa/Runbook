import { Test, TestingModule } from '@nestjs/testing';
import { RunbooksController } from './runbooks.controller';
import { RunbooksService } from './runbooks.service';

describe('RunbooksController', () => {
  let controller: RunbooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunbooksController],
      providers: [RunbooksService],
    }).compile();

    controller = module.get<RunbooksController>(RunbooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
