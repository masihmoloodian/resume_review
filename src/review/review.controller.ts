import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Add new review' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(@User() user: UserEntity, @Body() dto: CreateReviewDto) {
    const result = await this.reviewService.create(user.id, dto);
    return new ResponseDto(result);
  }

  @Get()
  @ApiOperation({ summary: "Get all user's review" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll(@User() user: UserEntity) {
    const result = this.reviewService.getAll(user.id);
    return new ResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a user's review by id" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const result = this.reviewService.getById(user.id, id);
    return new ResponseDto(result);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a user's review by id" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const result = this.reviewService.update(user.id, id, dto);
    return new ResponseDto(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete a user's review by id" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    const result = this.reviewService.remove(user.id, id);
    return new ResponseDto(result);
  }
}
