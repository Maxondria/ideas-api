import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';
import { commentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  private async FindAuthorHelper(userId: string, relations?: string[]) {
    const condition: any = { where: { id: userId } };
    if (relations && relations.length > 0) {
      condition.relations = [...relations];
    }
    return await this.userRepository.findOne({ ...condition });
  }

  private async FindCommentHelper(id: string, relations?: string[]) {
    const condition: any = { where: { id } };
    if (relations && relations.length > 0) {
      condition.relations = [...relations];
    }
    const comment = await this.commentRepository.findOne({ ...condition });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.BAD_REQUEST);
    }
    return comment;
  }

  private async findIdeaHelper(ideaId: string, relations?: string[]) {
    const condition: any = { where: { id: ideaId } };
    if (relations && relations.length > 0) {
      condition.relations = [...relations];
    }
    return await this.ideaRepository.findOne({ ...condition });
  }

  async showCommentsByIdea(ideaId: string) {
    try {
      const idea = await this.findIdeaHelper(ideaId, [
        'comments',
        'comments.author',
        'comments.idea',
      ]);

      if (!idea) {
        throw new HttpException('Comment Not Found', HttpStatus.BAD_REQUEST);
      }

      return idea.comments.map(comment => {
        return { ...comment, author: comment.author.toResponseObject() };
      });
    } catch (error) {
      throw error;
    }
  }

  async showCommentsByUser(id: string) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
    });
    return comments.map(comment => {
      return { ...comment, author: comment.author.toResponseObject() };
    });
  }

  async showComment(id: string) {
    const comment = await this.FindCommentHelper(id, ['author', 'idea']);
    return { ...comment, author: comment.author.toResponseObject() };
  }

  async deleteComment(Id: string, userId: string) {
    try {
      const comment = await this.FindCommentHelper(Id, ['author', 'idea']);

      if (comment.author.id !== userId) {
        throw new HttpException(
          'You do own this comment',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.commentRepository.remove(comment);
      return { ...comment, author: comment.author.toResponseObject() };
    } catch (error) {
      throw error;
    }
  }

  async addComment(ideaId: string, userId: string, data: Partial<commentDTO>) {
    const idea = await this.findIdeaHelper(ideaId);
    const author = await this.FindAuthorHelper(userId);

    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author,
    });

    await this.commentRepository.save(comment);
    return { ...comment, author: comment.author.toResponseObject() };
  }
}
