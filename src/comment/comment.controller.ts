import {
  Controller,
  Logger,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  Body,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { CustomUser } from '../user/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { commentDTO } from './comment.dto';

@Controller('api/comments')
export class CommentController {
  private logger = new Logger('IdeaController');
  constructor(private CommentService: CommentService) {}

  @Get(':id')
  async showComment(@Param('id') commentId: string) {
    return await this.CommentService.showComment(commentId);
  }

  @Get('idea/:id')
  async showCommentsByIdea(@Param('id') ideaId: string) {
    return await this.CommentService.showCommentsByIdea(ideaId);
  }

  @Get('user/:id')
  async showCommentsByUser(@Param('id') userId: string) {
    return await this.CommentService.showCommentsByUser(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(
    @Param('id') Id: string,
    @CustomUser('id') userId: string,
  ) {
    return await this.CommentService.deleteComment(Id, userId);
  }

  @Post('idea/:id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addComment(
    @CustomUser('id') userId: string,
    @Param('id') ideaId: string,
    @Body() data: Partial<commentDTO>,
  ) {
    return await this.CommentService.addComment(ideaId, userId, data);
  }
}
