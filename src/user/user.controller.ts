import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('api/users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('find/all')
  async RegisteredUsers() {
    return await this.UserService.RegisteredUsers();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async Login(@Body() data: UserDTO) {
    return await this.UserService.Login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async Register(@Body() data: UserDTO) {
    return await this.UserService.Register(data);
  }
}
