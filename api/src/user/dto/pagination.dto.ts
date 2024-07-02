import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  readonly page: number;
}

export interface PaginationResponse {
  total: number;
  take: number;
  skip: number;
  page: number;
}
