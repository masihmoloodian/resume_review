import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/service/user.service';
import { ResponseDto } from 'src/shared/dto/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: UserAuthDto) {
    const result = await this.userService.create(dto);
    return new ResponseDto(result);
  }

  @Post('login')
  async create(@Body() dto: UserAuthDto) {
    const result = await this.authService.signIn(dto);
    return new ResponseDto(result);
  }
}
