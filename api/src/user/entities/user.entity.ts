import { ParentEntity } from 'src/shared/entities/parent.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ResumeEntity } from 'src/resume/entities/resume.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
require('dotenv').config();

@Entity('users')
export class UserEntity extends ParentEntity {
  constructor(entity?: Partial<UserEntity>) {
    super();
    this.setArgumentToThisObject(entity);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  // ---------- Relations ----------

  @OneToMany(() => ResumeEntity, (resume) => resume.user, {
    cascade: true,
  })
  resume: ResumeEntity;

  @OneToMany(() => ReviewEntity, (review) => review.user, {
    cascade: true,
  })
  review: ReviewEntity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, Number(process.env.SALT_HASH));
    }
  }
}
