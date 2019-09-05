import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  private async FindAuthorHelper(userId: string, relns?: string[]) {
    const condition: any = { where: { id: userId } };
    if (relns && relns.length > 0) {
      condition.relations = [...relns];
    }
    return await this.userRepository.findOne({ ...condition });
  }

  private async FindCommentHelper(id: string, relns?: string[]) {
    const condition: any = { where: { id } };
    if (relns && relns.length > 0) {
      condition.relations = [...relns];
    }
    const comment = await this.commentRepository.findOne({ ...condition });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.BAD_REQUEST);
    }
    return comment;
  }

  private async findIdeaHelper(ideaId: string, relns?: string[]) {
    const condition: any = { where: { id: ideaId } };
    if (relns && relns.length > 0) {
      condition.relations = [...relns];
    }
    return await this.ideaRepository.findOne({ ...condition });
  }

  async showCommentsByIdea(ideaId: string) {
    const idea = await this.findIdeaHelper(ideaId, [
      'comments',
      'comments.author',
      'comments.idea',
    ]);

    return idea.comments;
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
