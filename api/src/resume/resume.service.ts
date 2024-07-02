import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,

    private readonly storageService: StorageService,
  ) {}

  async create(userId: string, dto: CreateResumeDto): Promise<ResumeEntity> {
    const url = await this.storageService.generatePublicUrl(dto.objectKey);
    delete dto.objectKey;
    const resume = this.resumeRepository.create({
      ...dto,
      url,
      userId,
    });
    return this.resumeRepository.save(resume);
  }

  async getAll(userId: string): Promise<ResumeEntity[]> {
    return this.resumeRepository.find({ where: { userId } });
  }

  async getById(userId: string, id: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({
      where: { id, userId },
    });
    if (!resume) throw new NotFoundException(`Resume with ID ${id} not found`);
    return resume;
  }

  async getAllReviewable(): Promise<ResumeEntity[]> {
    return this.resumeRepository.find({ where: { isReviewable: true } });
  }

  async getByIdReviewable(id: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({
      where: { id, isReviewable: true },
    });
    if (!resume) throw new NotFoundException(`Resume with ID ${id} not found`);
    return resume;
  }

  async getByIdWithDetail(userId: string, id: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({
      where: { id, userId },
      relations: ['review'],
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
    const resume = await this.getById(userId, id); // Check ownership

    let url = resume.url;
    if (dto.objectKey) {
      url = await this.storageService.generatePublicUrl(dto.objectKey);
      delete dto.objectKey;
    }

    await this.resumeRepository.update(id, {
      ...dto,
      url,
    });
    return await this.getById(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.getById(userId, id); // Check ownership
    const result = await this.resumeRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Resume with ID ${id} not found`);
  }
}
