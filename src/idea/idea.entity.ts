import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(type => userEntity, { cascade: true })
  @JoinTable()
  upvotes: userEntity[];

  @ManyToMany(type => userEntity, { cascade: true })
  @JoinTable()
  downvotes: userEntity[];
}
