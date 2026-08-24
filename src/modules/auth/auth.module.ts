import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { HashingProvider } from './providers/hashing-provider';
import { BcryptProvider } from './providers/bcrypt-provider';
import { SigninProvider } from './providers/signin-provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider
  }, SigninProvider],
  imports: [forwardRef(() => UsersModule)],
  exports: [AuthService, HashingProvider]
})
export class AuthModule { }
