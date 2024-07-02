import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteResumeDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => (value === 'true' ? true : false))
  keepFile: boolean;
}
