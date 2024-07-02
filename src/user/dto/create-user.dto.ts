import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserAuthDto {
  @ApiProperty({
    example: 'masihmoloodian@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password',
  })
  @IsString()
  @Length(3, 20)
  readonly password: string;
}
