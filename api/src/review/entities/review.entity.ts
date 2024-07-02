import { ResumeEntity } from 'src/resume/entities/resume.entity';
import { ParentEntity } from 'src/shared/entities/parent.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class ReviewEntity extends ParentEntity {
  constructor(entity?: Partial<ReviewEntity>) {
    super();
    this.setArgumentToThisObject(entity);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'resume_id' })
  resumeId: string;

  @Column('text')
  content: string;

  // ---------- Relations ----------

  @ManyToOne(() => UserEntity, (user) => user.review)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ResumeEntity, (resume) => resume.review)
  @JoinColumn({ name: 'resume_id' })
  resume: ResumeEntity;
}
