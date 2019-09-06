import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { hash, compare } from 'bcryptjs';
import { UserRO } from './user.dto';
import { IdeaEntity } from '../idea/idea.entity';

@Entity('user')
export class UserEntity {
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

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity;

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  toResponseObject(): UserRO {
    const { id, created, username, updated, ideas, bookmarks } = this;
    let response: any = { id, created, username, updated };
    if (ideas) {
      response.ideas = ideas;
    }
    if (bookmarks) {
      response.bookmarks = bookmarks;
    }
    return response;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await compare(attempt, this.password);
  }
}
