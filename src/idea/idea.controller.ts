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
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { CustomUser } from '../user/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');
  constructor(private IdeaService: IdeaService) {}

  private LogData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }

  @Get()
  async showAllIdeas(): Promise<IdeaRO[]> {
    return await this.IdeaService.showAllIdeas();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async createIdea(
    @Body() data: IdeaDTO,
    @CustomUser('id') user: string,
  ): Promise<IdeaRO> {
    this.LogData({ user, data });
    return await this.IdeaService.createIdea(data, user);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return await this.IdeaService.readIdea(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDTO>,
  ): Promise<IdeaRO> {
    this.logger.warn(`NEW POST DATA: ${JSON.stringify(data)}`);
    return await this.IdeaService.updateIdea(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeIdea(@Param('id') id: string): Promise<{ deleted: string }> {
    return await this.IdeaService.removeIdea(id);
  }
}
