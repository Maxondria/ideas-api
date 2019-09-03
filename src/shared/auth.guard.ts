import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) return false;

    const user = await this.validateToken(request.headers.authorization);
    request.user = user;
    return true;
  }

  private async validateToken(auth: string) {
    const [Bearer, Token] = auth.split(' ');
    if (Bearer !== 'Bearer') {
      throw new HttpException('AUTHENTICATION FAILED', HttpStatus.FORBIDDEN);
    }

    try {
      const decodedToken = await verify(Token, process.env.SECRET);
      return decodedToken;
    } catch (error) {
      throw new HttpException('AUTHENTICATION FAILED', HttpStatus.FORBIDDEN);
    }
  }
}
