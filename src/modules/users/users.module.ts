import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateManyUsers as CreateManyUsersProvider } from './providers/create-many-users';
import { PaginationModule } from '../common/pagination.module';
import { CreateUserProvider } from './providers/create-user-provider';
import { FindUserByEmail } from './providers/find-user-by-email';
import jwtConfig from '../auth/config/jwt-config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    CreateManyUsersProvider,
    CreateUserProvider,
    FindUserByEmail,
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard
    // }
  ],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    PaginationModule
    // ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider())
  ]
})
export class UsersModule { }
