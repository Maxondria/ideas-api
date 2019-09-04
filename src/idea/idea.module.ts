import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from './idea.controller';
import { ideaEntity } from './idea.entity';
import { IdeaService } from './idea.service';
import { userEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ideaEntity, userEntity])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
