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
  Query,
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
  constructor(private ideaService: IdeaService) {}

  private LogData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }

  @Get()
  async showAllIdeas(@Query('page') page: number): Promise<IdeaRO[]> {
    return await this.ideaService.showAllIdeas(page);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async createIdea(
    @Body() data: IdeaDTO,
    @CustomUser('id') user: string,
  ): Promise<IdeaRO> {
    this.LogData({ user, data });
    return await this.ideaService.createIdea(data, user);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return await this.ideaService.readIdea(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDTO>,
    @CustomUser('id') user: string,
  ): Promise<IdeaRO> {
    return await this.ideaService.updateIdea(id, user, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeIdea(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<{ deleted: string }> {
    return await this.ideaService.removeIdea(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(AuthGuard('jwt'))
  async upvoteIdea(@Param('id') id: string, @CustomUser('id') user: string) {
    this.LogData({ id, user });
    return await this.ideaService.upvoteIdea(id, user);
  }

  @Delete(':id/downvote')
  @UseGuards(AuthGuard('jwt'))
  async downvoteIdea(@Param('id') id: string, @CustomUser('id') user: string) {
    this.LogData({ id, user });
    return await this.ideaService.downvoteIdea(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async addBookmark(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<UserRO> {
    this.LogData({ id, user });
    return await this.ideaService.addBookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmark(
    @Param('id') id: string,
    @CustomUser('id') user: string,
  ): Promise<UserRO> {
    this.LogData({ id, user });
    return await this.ideaService.deleteBookmark(id, user);
  }
}
