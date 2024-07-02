import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'page must be a number' })
  @Min(1, { message: 'page must be at least 1' })
  @Max(100)
  @IsOptional()
  page?: number = 1;
}
