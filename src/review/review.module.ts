import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewEntity } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeModule } from 'src/resume/resume.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), ResumeModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
