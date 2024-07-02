import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { ResponseDto } from 'src/shared/dto/response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Get user's data" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async user(@User() user: UserEntity): Promise<any> {
    const result = await this.userService.getById(user.id);
    return new ResponseDto(result);
  }
}
