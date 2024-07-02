import { ReviewEntity } from 'src/review/entities/review.entity';
import { ParentEntity } from 'src/shared/entities/parent.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resumes')
export class ResumeEntity extends ParentEntity {
  constructor(entity?: Partial<ResumeEntity>) {
    super();
    this.setArgumentToThisObject(entity);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column()
  objectKey: string;

  @Column({ name: 'is_reviewable' })
  isReviewable: boolean;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  // ---------- Relations ----------

  @ManyToOne(() => UserEntity, (user) => user.resume)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ReviewEntity, (review) => review.resume, {
    cascade: true,
  })
  review: ReviewEntity;
}
