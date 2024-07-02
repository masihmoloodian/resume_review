import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  objectKey: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isReviewable: boolean;
}
