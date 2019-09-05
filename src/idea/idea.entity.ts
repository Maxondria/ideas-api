import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { userEntity } from '../user/user.entity';
import { commentEntity } from '../comment/comment.entity';

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

  @OneToMany(type => commentEntity, comment => comment.idea, { cascade: true })
  comments: commentEntity[];

  @ManyToMany(type => userEntity, { cascade: true })
  @JoinTable()
  upvotes: userEntity[];

  @ManyToMany(type => userEntity, { cascade: true })
  @JoinTable()
  downvotes: userEntity[];
}
