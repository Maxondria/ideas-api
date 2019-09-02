import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';

@Controller('ideas')
export class IdeaController {
  constructor(private IdeaService: IdeaService) {}
  @Get()
  async showAllIdeas() {
    return await this.IdeaService.showAllIdeas();
  }

  @Post()
  async createIdea(@Body() data: IdeaDTO) {
    return await this.IdeaService.createIdea(data);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return await this.IdeaService.readIdea(id);
  }

  @Put(':id')
  async updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    return await this.IdeaService.updateIdea(id, data);
  }

  @Delete(':id')
  async removeIdea(@Param('id') id: string) {
    return await this.IdeaService.removeIdea(id);
  }
}
