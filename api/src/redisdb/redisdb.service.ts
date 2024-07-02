import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisdbService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(
    key: string,
    value: any,
    expireTimeInSeconds: number,
  ): Promise<void> {
    await this.redis.set(key, value, 'EX', expireTimeInSeconds);
  }

  async getByKey(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}
