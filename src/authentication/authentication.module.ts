import { VerificationModule } from '../stratergies/verification.module';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [VerificationModule, UserModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
