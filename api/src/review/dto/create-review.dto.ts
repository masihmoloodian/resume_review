import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  resumeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
