import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import { hash, compare } from 'bcryptjs';
import { UserRO } from './user.dto';
import { ideaEntity } from '../idea/idea.entity';

@Entity('user')
export class userEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => ideaEntity, idea => idea.author)
  ideas: ideaEntity;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  toResponseObject(): UserRO {
    const { id, created, username, updated } = this;
    return { id, created, username, updated };
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await compare(attempt, this.password);
  }
}
