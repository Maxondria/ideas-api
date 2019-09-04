import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { userEntity } from '../user/user.entity';

@Entity('idea')
export class ideaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @ManyToOne(type => userEntity, author => author.ideas)
  author: userEntity;
}
