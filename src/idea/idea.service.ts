import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from '../user/user.entity';
import { UserRO } from '../user/user.dto';
import { Votes } from '../shared/votes.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private async ideaExists(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!idea) {
      throw new HttpException('Resource Not Found', HttpStatus.NOT_FOUND);
    }
    return this.ScrapOffUserPassword(idea);
  }

  private ScrapOffUserPassword(idea: IdeaEntity): IdeaRO | any {
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

  private async UserAndIdeaFinder(
    id: string,
    userId: string,
    userRelations?: string[],
    ideaRelations?: string[],
  ) {
    const ideaOptons: any = {
      where: { id },
    };

    const userOptions: any = {
      where: { id: userId },
    };

    if (userRelations && userRelations.length > 0) {
      userOptions.relations = [...userRelations];
    }

    if (ideaRelations && ideaRelations.length > 0) {
      ideaOptons.relations = [...ideaRelations];
    }

    try {
      const idea = await this.ideaRepository.findOne({ ...ideaOptons });
      const user = await this.userRepository.findOne({ ...userOptions });
      return { user, idea };
    } catch (error) {
      throw new HttpException(
        'Could Not Bookmark User/Idea',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private EnsureIdeaOwnership(idea: IdeaRO, user: string): void {
    if (idea.author.id !== user) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  private async CastVote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException('Unable to Cast Vote', HttpStatus.BAD_REQUEST);
    }
    return {
      ...idea,
      author: idea.author.toResponseObject(),
      upvotes: idea.upvotes.length,
      downvotes: idea.downvotes.length,
    };
  }

  async upvoteIdea(id: string, userId: string) {
    const { idea, user } = await this.UserAndIdeaFinder(
      id,
      userId,
      [],
      ['author', 'upvotes', 'downvotes'],
    );
    return await this.CastVote(idea, user, Votes.UP);
  }

  async downvoteIdea(id: string, userId: string) {
    const { idea, user } = await this.UserAndIdeaFinder(
      id,
      userId,
      [],
      ['author', 'upvotes', 'downvotes'],
    );
    return await this.CastVote(idea, user, Votes.DOWN);
  }

  async showAllIdeas(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    return ideas.map(idea => this.ScrapOffUserPassword(idea));
  }

  async createIdea(data: IdeaDTO, userId: string): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      const idea = await this.ideaRepository.create({ ...data, author: user });
      await this.ideaRepository.save(idea);
      return this.ScrapOffUserPassword(idea);
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
    try {
      const { idea, user } = await this.UserAndIdeaFinder(id, userId, [
        'bookmarks',
      ]);

      if (
        user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1
      ) {
        user.bookmarks.push(idea);
        await this.userRepository.save(user);
      } else {
        throw new HttpException(
          'IDEA ALREADY BOOKMARKED',
          HttpStatus.BAD_REQUEST,
        );
      }
      return user.toResponseObject();
    } catch (error) {
      throw error;
    }
  }

  async deleteBookmark(id: string, userId: string): Promise<UserRO> {
    try {
      const { idea, user } = await this.UserAndIdeaFinder(id, userId, [
        'bookmarks',
      ]);
      if (
        user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0
      ) {
        user.bookmarks = user.bookmarks.filter(
          bookmark => bookmark.id !== idea.id,
        );
        await this.userRepository.save(user);
      } else {
        throw new HttpException('IDEA DOESNOT EXIST', HttpStatus.BAD_REQUEST);
      }
      return user.toResponseObject();
    } catch (error) {
      throw error;
    }
  }
}
