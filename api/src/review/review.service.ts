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
import { SQL_TAKE } from 'src/shared/const/sql-take.const';

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

  async getAll(userId: string, page: number = 1): Promise<any> {
    const take = SQL_TAKE;
    const [results, total] = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.userId = :userId', { userId })
      .select([
        'review.id',
        'review.created_at',
        'review.userId',
        'review.resumeId',
      ])
      .skip((page - 1) * take)
      .take(take)
      .orderBy('review.created_at', 'ASC')
      .getManyAndCount();

    return {
      data: results,
      metadata: {
        total,
        page: +page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async getAllByResumeId(
    userId: string,
    resumeId: string,
    page: number = 1,
  ): Promise<any> {
    const take = SQL_TAKE;
    const [results, total] = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.resumeId = :resumeId', { resumeId })
      .andWhere('review.userId = :userId', { userId })
      .select(['review'])
      .skip((page - 1) * take)
      .take(take)
      .orderBy('review.created_at', 'ASC')
      .getManyAndCount();

    return {
      data: results,
      metadata: {
        total,
        page: +page,
        lastPage: Math.ceil(total / take),
      },
    };
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

  async remove(userId: string, id: string): Promise<any> {
    await this.getById(userId, id); // Check ownership
    return await this.reviewRepository.delete(id);
  }
}
