import { Test, TestingModule } from '@nestjs/testing';
import { RedisdbService } from './redisdb.service';

describe('RedisdbService', () => {
  let service: RedisdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisdbService],
    }).compile();

    service = module.get<RedisdbService>(RedisdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
