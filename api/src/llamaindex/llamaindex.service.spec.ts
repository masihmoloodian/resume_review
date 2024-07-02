import { Test, TestingModule } from '@nestjs/testing';
import { LlamaindexService } from './llamaindex.service';

describe('LlamaindexService', () => {
  let service: LlamaindexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlamaindexService],
    }).compile();

    service = module.get<LlamaindexService>(LlamaindexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
