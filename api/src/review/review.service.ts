import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ResumeService } from 'src/resume/resume.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,

    private readonly resumeService: ResumeService,
  ) {}

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewEntity> {
    await this.resumeService.isExist(dto.resumeId);
    const isExits = await this.reviewRepository.findOne({
      where: {
        userId,
        resumeId: dto.resumeId,
      },
    });
    if (isExits)
      throw new BadRequestException(
        'You have already submitted a review for this resume.',
      );
    const review = this.reviewRepository.create({
      ...dto,
      userId,
    });
    return this.reviewRepository.save(review);
  }

  async getAll(userId: string): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      where: {
        userId,
      },
    });
  }

  async getById(userId: string, id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
    });
    if (!review) throw new NotFoundException(`Review with ID ${id} not found`);
    return review;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    await this.getById(userId, id); // Check ownership
    await this.reviewRepository.update(id, dto);
    return this.getById(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.getById(userId, id); // Check ownership
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}
