import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { StorageService } from 'src/storage/storage.service';
import { SQL_TAKE } from 'src/shared/const/sql-take.const';
import {
  GetResumeForReviewers,
  ResumeStatusEnum,
} from './dto/get-resume-for-reviewers.dto';
import { DeleteResumeDto } from './dto/delete-resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,

    private readonly storageService: StorageService,
  ) {}

  async create(userId: string, dto: CreateResumeDto): Promise<ResumeEntity> {
    await this.storageService.getObject(dto.objectKey);
    const resume = this.resumeRepository.create({
      ...dto,
      userId,
    });
    return this.resumeRepository.save(resume);
  }

  async getFile(userId: string, id: string) {
    const resume = await this.resumeRepository.findOne({
      where: {
        id,
      },
    });

    if (!resume) throw new NotFoundException('Resume not found');
    if (!resume.isReviewable && resume.userId != userId)
      throw new BadRequestException('This Resume is not reviewable');

    return await this.storageService.generateSignedUrl(resume.objectKey, 3600);
  }

  async getAll(userId: string, page: number = 1): Promise<any> {
    const take = SQL_TAKE;
    const [results, total] = await this.resumeRepository
      .createQueryBuilder('resume')
      .where('resume.userId = :userId', { userId })
      .select(['resume'])
      .skip((page - 1) * take)
      .take(take)
      .orderBy('resume.created_at', 'DESC')
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

  async getById(userId: string, id: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({
      where: { id, userId },
    });
    if (!resume) throw new NotFoundException(`Resume with ID ${id} not found`);
    return resume;
  }

  async getAllReviewable(dto: GetResumeForReviewers): Promise<any> {
    const take = SQL_TAKE;
    const page = dto.page || 1;
    let query = this.resumeRepository
      .createQueryBuilder('resume')
      .where('resume.isReviewable = :isReviewable', { isReviewable: true })
      .select(['resume'])
      .skip((page - 1) * take)
      .take(take)
      .orderBy('resume.created_at', 'DESC');

    if (dto.status == ResumeStatusEnum.REVIEWABLE)
      query.where('resume.isReviewable = :isReviewable', {
        isReviewable: true,
      });

    if (dto.status == ResumeStatusEnum.PUBLIC)
      query.where('resume.isPublic = :isPublic', {
        isPublic: true,
      });

    const [results, total] = await query.getManyAndCount();

    return {
      data: results,
      metadata: {
        total,
        page: +page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async getByIdReviewable(id: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({
      where: { id, isReviewable: true },
    });
    if (!resume) throw new NotFoundException(`Resume with ID ${id} not found`);
    return resume;
  }

  async isExist(id: string): Promise<boolean> {
    const resume = await this.resumeRepository.findOne({
      where: { id },
    });
    if (!resume) throw new NotFoundException(`Resume with ID ${id} not found`);
    return true;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateResumeDto,
  ): Promise<ResumeEntity> {
    await this.getById(userId, id); // Check ownership

    if (dto.objectKey) await this.storageService.getObject(dto.objectKey);

    await this.resumeRepository.update(id, {
      ...dto,
    });
    return await this.getById(userId, id);
  }

  async remove(
    userId: string,
    id: string,
    dto: DeleteResumeDto,
  ): Promise<void> {
    const resume = await this.getById(userId, id); // Check ownership
    const result = await this.resumeRepository.delete(id);

    if ((dto.keepFile as any) == 'false') {
      await this.storageService.delete(resume.objectKey);
    }
    if (result.affected === 0)
      throw new NotFoundException(`Resume with ID ${id} not found`);
  }
}
