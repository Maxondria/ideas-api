import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { LocalStrategy } from './passport/local.stratergy';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './passport/jwt.stratergy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [VerificationService, LocalStrategy, JwtStrategy],
  exports: [VerificationService],
})
export class VerificationModule {}
