import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';
// import { AuthGuard } from '../shared/auth.guard';
import { CustomUser } from './user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('find/all')
  // @UseGuards(new AuthGuard())
  async RegisteredUsers(@CustomUser() authedUser) {
    return await this.UserService.RegisteredUsers();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async Login(@Request() req) {
    return req.user;
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async Register(@Body() data: UserDTO) {
    return await this.UserService.Register(data);
  }
}
