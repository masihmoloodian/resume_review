import { ParentEntity } from 'src/shared/entities/parent.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, Number(process.env.SALT_HASH));
    }
  }
}
