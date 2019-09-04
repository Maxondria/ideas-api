import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerificationService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.UserService.Login({ username, password });
    if (user) {
      return user;
    }
    return null;
  }

  async AccessToken(user: any) {
    return {
      token: this.jwtService.sign({ username: user.username, id: user.id }),
    };
  }
}
