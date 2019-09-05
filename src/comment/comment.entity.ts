import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { userEntity } from '../user/user.entity';
import { ideaEntity } from '../idea/idea.entity';

@Entity('comment')
export class commentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  comment: string;

  @ManyToOne(type => userEntity)
  @JoinTable()
  author: userEntity;

  @ManyToOne(type => ideaEntity, idea => idea.comments)
  idea: ideaEntity;
}
