import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class ParentEntity extends BaseEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  protected setArgumentToThisObject(obj: any, ignores: string[] = []) {
    const defaultIgnores = new Set([
      'deleted_at',
      'updated_at',
      'created_at',
      ...ignores,
    ]);

    for (const key in obj) {
      if (!defaultIgnores.has(key)) this[key] = obj[key];
    }
  }
}
