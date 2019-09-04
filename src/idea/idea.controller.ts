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
import { UserRO } from '../user/user.dto';
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
    @CustomUser('id') user: string,
  ): Promise<IdeaRO> {
    return await this.IdeaService.updateIdea(id, user, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeIdea(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<{ deleted: string }> {
    return await this.IdeaService.removeIdea(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async addBookmark(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<UserRO> {
    this.LogData({ id, user });
    return await this.IdeaService.addBookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmark(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<UserRO> {
    this.LogData({ id, user });
    return await this.IdeaService.deleteBookmark(id, user);
  }
}
