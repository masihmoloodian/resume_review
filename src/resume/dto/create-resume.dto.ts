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
  @IsString()
  @IsNotEmpty()
  visibility: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isReviewable: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;
}
