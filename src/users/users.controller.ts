import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Put,
    Param,
    Query,
    Body,
    Req,
    ParseIntPipe,
    Headers,
    Ip
} from '@nestjs/common';
import type { CreateUser } from 'src/types/users/users-crud';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    @Get()
    public getAllUsers(
        @Query('limit',ParseIntPipe) limit?: number): string {
        console.log(limit);
        return 'This action returns all users';
    }

    @Get(':id')
    public getUsers(@Param('id') id: string): string {
        return `This action returns user with id ${id}`;
    }

    @Post()
    public createUser(@Body() body: CreateUser,@Headers() headers: any,@Ip() ip: string): CreateUser {
        console.log(body);
        console.log(headers);
        console.log(ip);

        return body;
    }

    @Put(':id')
    public updateUser(): string {
        return 'This action updates a user';
    }

    @Delete(':id')
    public deleteUser(): string {
        return 'This action deletes a user';
    }

    @Patch(':id')
    public patchUser(): string {
        return 'This action patches a user';
    }
}
