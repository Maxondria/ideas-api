import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentEntity } from './comment.entity';
import { userEntity } from '../user/user.entity';
import { ideaEntity } from '../../dist/idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([commentEntity, userEntity, ideaEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
 