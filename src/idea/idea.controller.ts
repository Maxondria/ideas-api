import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private IdeaService: IdeaService) {}
  @Get()
  async showAllIdeas() {
    return await this.IdeaService.showAllIdeas();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createIdea(@Body() data: IdeaDTO) {
    this.logger.warn(`NEW POST DATA: ${JSON.stringify(data)}`);
    return await this.IdeaService.createIdea(data);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return await this.IdeaService.readIdea(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    this.logger.warn(`NEW POST DATA: ${JSON.stringify(data)}`);
    return await this.IdeaService.updateIdea(id, data);
  }

  @Delete(':id')
  async removeIdea(@Param('id') id: string) {
    return await this.IdeaService.removeIdea(id);
  }
}
