import { PartialType } from '@nestjs/swagger';
import { UserAuthDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserAuthDto) {}
