import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/user/dto/pagination.dto';

export enum ResumeStatusEnum {
  REVIEWABLE = 'reviewable',
  PUBLIC = 'public',
}

export class GetResumeForReviewers extends PaginationDto {
  @ApiProperty({ enum: ResumeStatusEnum })
  @IsEnum(ResumeStatusEnum)
  @IsNotEmpty()
  status: ResumeStatusEnum;
}
