import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRO, UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findUser(
    username: string,
    Exception: boolean = true,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (Exception) {
      if (user) {
        throw new HttpException('USER EXISTS ALREADY', HttpStatus.BAD_REQUEST);
      }
    }
    return user;
  }

  async RegisteredUsers(): Promise<UserRO[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
    });
    return users.map(user => user.toResponseObject());
  }

  async Login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.findUser(username, false);
    if (!user || !(await user.comparePassword(password))) {
      return null;
    }
    return user.toResponseObject();
  }

  async Register(data: UserDTO) {
    try {
      const { username } = data;
      let user = await this.findUser(username);
      if (!user) {
        user = this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
      }
    } catch (error) {
      throw error;
    }
  }
}
