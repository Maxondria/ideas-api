import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ideaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(ideaEntity)
    private ideaRepository: Repository<ideaEntity>,
  ) {}

  private async ideaExists(id: string): Promise<ideaEntity> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Resource Not Found', HttpStatus.NOT_FOUND);
    }
    return idea;
  }

  async showAllIdeas() {
    return await this.ideaRepository.find();
  }

  async createIdea(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async readIdea(id: string) {
    try {
      const idea = await this.ideaExists(id);
      return idea;
    } catch (error) {
      throw error;
    }
  }

  async updateIdea(id: string, data: Partial<IdeaDTO>) {
    try {
      const idea = await this.ideaExists(id);
      await this.ideaRepository.update({ id: idea.id }, data);
      return await this.ideaExists(id);
    } catch (error) {
      throw error;
    }
  }

  async removeIdea(id: string) {
    try {
      const idea = await this.ideaExists(id);
      await this.ideaRepository.delete({ id: idea.id });
      return { deleted: 'deleted' };
    } catch (error) {
      throw error;
    }
  }
}
