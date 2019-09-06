import { IdeaEntity } from './../idea/idea.entity';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, IdeaEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
