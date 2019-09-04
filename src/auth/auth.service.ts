import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly UserService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.UserService.Login({ username, password });
    if (user) {
      return user;
    }
    return null;
  }
}
