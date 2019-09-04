import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ValidationPipe } from '../shared/validation.pipe';

import { VerificationService } from '../stratergies/verification.service';
import { CustomUser } from '../user/user.decorator';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthenticationController {
  constructor(
    private UserService: UserService,
    private verificationService: VerificationService,
  ) {}

  @Get('find/all')
  @UseGuards(AuthGuard('jwt'))
  async RegisteredUsers(@CustomUser() authedUser) {
    return await this.UserService.RegisteredUsers();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async Login(@Request() req) {
    return {
      ...req.user,
      ...(await this.verificationService.AccessToken(req.user)),
    };
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async Register(@Body() data: UserDTO) {
    return await this.UserService.Register(data);
  }
}
