import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {  CreateManyUsers as CreateManyUsersProvider } from './providers/create-many-users';
import { PaginationModule } from '../common/pagination.module';
import { CreateUserProvider } from './providers/create-user-provider';

@Module({
  controllers: [UsersController],
  providers: [UserService, CreateManyUsersProvider, CreateUserProvider],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    PaginationModule
  ]
})
export class UsersModule { }
