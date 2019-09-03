import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import { hash, compare } from 'bcryptjs';
import { UserRO } from './user.dto';
import { sign } from 'jsonwebtoken';

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

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, username, updated, token } = this;
    const response = { id, created, username, updated, token };
    if (!showToken) {
      response.token = undefined;
    }
    return response;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await compare(attempt, this.password);
  }

  private get token(): string {
    const { id, username } = this;
    return sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}
