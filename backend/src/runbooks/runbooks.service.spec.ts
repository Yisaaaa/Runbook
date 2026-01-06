import { Test, TestingModule } from '@nestjs/testing';
import { RunbooksService } from './runbooks.service';

describe('RunbooksService', () => {
  let service: RunbooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunbooksService],
    }).compile();

    service = module.get<RunbooksService>(RunbooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
