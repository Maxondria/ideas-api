import { Injectable } from '@nestjs/common';
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

  async showAllIdeas() {
    return await this.ideaRepository.find();
  }

  async createIdea(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async readIdea(id: string) {
    return this.ideaRepository.findOne({ where: { id } });
  }

  async updateIdea(id: string, data: Partial<IdeaDTO>) {
    await this.ideaRepository.update({ id }, data);
    return this.ideaRepository.findOne({ id });
  }

  async removeIdea(id: string) {
    await this.ideaRepository.delete({ id });
    return { deleted: 'deleted' };
  }
}
