import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ideaEntity } from '../idea/idea.entity';
import { userEntity } from '../user/user.entity';
import { commentEntity } from './comment.entity';
import { commentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
    @InjectRepository(commentEntity)
    private commentRepository: Repository<commentEntity>,
  ) {}

  async showCommentsByIdea(ideaId: string) {}

  async showCommentsByUser(userId: string) {}

  async showComment(ideaId: string) {}

  async deleteComment(ideaId: string) {}

  async addComment(ideaId: string, userId: string, data: Partial<commentDTO>) {}
}
