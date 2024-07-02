import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisdbService } from './redisdb.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: new Redis({
	host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      }),
    },
    RedisdbService,
  ],
  exports: ['REDIS_CLIENT', RedisdbService],
})
export class RedisdbModule {}
