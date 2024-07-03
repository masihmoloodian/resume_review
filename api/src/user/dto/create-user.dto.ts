import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserAuthDto {
  @ApiProperty({
    example: 'masihmoloodian@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password (Must include upper and lower case letters, numbers, and special characters)',
  })
  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'password must include upper and lower case letters, numbers, and special characters',
  })
  readonly password: string;
}
