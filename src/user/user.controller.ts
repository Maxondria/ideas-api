import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { CustomUser } from './user.decorator';

@Controller('api/users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('find/all')
  @UseGuards(new AuthGuard())
  async RegisteredUsers(@CustomUser() authedUser) {
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
