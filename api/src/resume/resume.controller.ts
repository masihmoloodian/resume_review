import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/shared/decorators/user.decorator';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PaginationDto } from 'src/shared/dto/pagniation.dto';
import { GetResumeForReviewers } from './dto/get-resume-for-reviewers.dto';
import { DeleteResumeDto } from './dto/delete-resume.dto';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: 'Add new Resume' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@User() user: UserEntity, @Body() dto: CreateResumeDto) {
    const result = await this.resumeService.create(user.id, dto);
    return new ResponseDto(result);
  }

  @Get('reviewer')
  @ApiOperation({ summary: "Get all user's resume for reviewers" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAllReviewable(@Query() dto: GetResumeForReviewers) {
    const result = await this.resumeService.getAllReviewable(dto);
    return new ResponseDto(result.data, result.metadata);
  }

  @Get('reviewer/:id')
  @ApiOperation({ summary: "Get a user's resume by id for reviewers" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getByIdReviewable(
    @Param('id') id: string,
    @Query() dto: GetResumeForReviewers,
  ) {
    const result = await this.resumeService.getByIdReviewable(id);
    return new ResponseDto(result);
  }

  @Get('file/:id')
  @ApiOperation({ summary: 'Get a resume file' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getResume(@User() user: UserEntity, @Param('id') id: string) {
    const result = await this.resumeService.getFile(user.id, id);
    return new ResponseDto(result);
  }

  @Get()
  @ApiOperation({ summary: "Get all user's resume" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAll(@User() user: UserEntity, @Query() dto: PaginationDto) {
    const result = await this.resumeService.getAll(user.id, dto.page);
    return new ResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a user's resume by id" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getById(@User() user: UserEntity, @Param('id') id: string) {
    const result = await this.resumeService.getById(user.id, id);
    return new ResponseDto(result);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a resume by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    const result = await this.resumeService.update(user.id, id, dto);
    return new ResponseDto(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resume by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async remove(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Query() dto: DeleteResumeDto,
  ) {
    const result = await this.resumeService.remove(user.id, id, dto);
    return new ResponseDto(result);
  }
}
