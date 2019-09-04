import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ideaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { userEntity } from '../user/user.entity';
import { UserRO } from '../user/user.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
  ) {}

  private async ideaExists(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('Resource Not Found', HttpStatus.NOT_FOUND);
    }
    return this.sanitizeDataWithUser(idea);
  }

  private sanitizeDataWithUser(idea: ideaEntity): IdeaRO | any {
    const response: any = {
      ...idea,
      author: idea.author.toResponseObject(),
    };
    if (response.upvotes) {
      response.upvotes = idea.upvotes.length;
    }

    if (response.downvotes) {
      response.downvotes = idea.downvotes.length;
    }
    return response;
  }

  private async bookmarksHelper(
    id: string,
    userId: string,
  ): Promise<{ user: userEntity; idea: ideaEntity }> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    return { user, idea };
  }

  private EnsureIdeaOwnership(idea: IdeaRO, user: string): void {
    if (idea.author.id !== user) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAllIdeas(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes'],
    });
    return ideas.map(idea => this.sanitizeDataWithUser(idea));
  }

  async createIdea(data: IdeaDTO, userId: string): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      const idea = await this.ideaRepository.create({ ...data, author: user });
      await this.ideaRepository.save(idea);
      return this.sanitizeDataWithUser(idea);
    }
    throw new HttpException("User doesn't Exist", HttpStatus.NOT_FOUND);
  }

  async readIdea(id: string): Promise<IdeaRO> {
    try {
      return await this.ideaExists(id);
    } catch (error) {
      throw error;
    }
  }

  async updateIdea(
    id: string,
    user: string,
    data: Partial<IdeaDTO>,
  ): Promise<IdeaRO> {
    try {
      const idea = await this.ideaExists(id);
      this.EnsureIdeaOwnership(idea, user);
      await this.ideaRepository.update({ id: idea.id }, data);
      return await this.ideaExists(id);
    } catch (error) {
      throw error;
    }
  }

  async removeIdea(id: string, user: string): Promise<{ deleted: string }> {
    try {
      const idea = await this.ideaExists(id);
      this.EnsureIdeaOwnership(idea, user);
      await this.ideaRepository.delete({ id: idea.id });
      return { deleted: 'deleted' };
    } catch (error) {
      throw error;
    }
  }

  async addBookmark(id: string, userId: string): Promise<UserRO> {
    const { user, idea } = await this.bookmarksHelper(id, userId);

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      this.userRepository.save(user);
    } else {
      throw new HttpException(
        'IDEA ALREADY BOOKMARKED',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async deleteBookmark(id: string, userId: string): Promise<UserRO> {
    const { user, idea } = await this.bookmarksHelper(id, userId);
    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      this.userRepository.save(user);
    } else {
      throw new HttpException('IDEA DOESNOT EXIST', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }
}
