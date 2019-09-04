import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
