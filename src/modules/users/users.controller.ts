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
    DefaultValuePipe,
    ValidationPipe,
    Headers,
    Ip,
    Logger
} from '@nestjs/common';
// import type { CreateUser } from 'src/types/users/users-crud';
import { Request } from 'express';
import { CreateUserDto, GetUserDTO, PatchUserDto } from 'src/dtos/users/users.dto';
import { UserService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    //Injecting UserService (Dependency Injection)
    constructor(private userService: UserService) {

    }
    private logger = new Logger(UsersController.name);

    @Get()
    @ApiQuery({
        name: "page",
        type: "number",
        required: false,
        description:"page number",
        example:1
    })
    @ApiQuery({
        name: "limit",
        type: "number",
        required: false,
        description:"number of entries returned per query",
        example:10
    })
    @ApiOperation({
        summary:"Fetches the list of users"
    })
    @ApiResponse({
        status:200,
        description:"Users fetched successfully"
    })
    public async getAllUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
    ) {
        const users = await this.userService.findAllUsers(page, limit);
        return users;
    }

    @Get(':id')
    public async getUserById(@Param() params: GetUserDTO) {
        return await this.userService.findUserById(params.id);
    }

    @Post()
    public createUser(
        @Body() body: CreateUserDto
    ) {
        this.logger.log(typeof body);
        this.logger.log(body instanceof CreateUserDto);

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
    public patchUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: PatchUserDto
    ): string {
        this.logger.log(request)
        return 'This action patches a user';
    }
}
