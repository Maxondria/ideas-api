import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Idea {
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() created: Date;

  @Column('text') idea: string;

  @Column('text') description: string;
}
