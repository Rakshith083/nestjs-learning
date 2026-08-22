import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/dtos/users/users.dto";


export class CreateManyUsersDto {
    @IsNotEmpty()
    @IsArray()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    @ApiProperty({
        description: "Array of users to be created",
        type: 'array',
        required: true,
        items: {
            type: 'object'
        }
    })
    users: CreateUserDto[];
}