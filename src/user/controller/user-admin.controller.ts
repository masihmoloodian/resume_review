import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin User')
@Controller('admin/user')
export class UserAdminController {}
