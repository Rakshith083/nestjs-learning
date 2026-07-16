import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

PartialType
export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(12)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{8,20}$/, { message: "Min 8 chars ,atleast 1 ltter,1 number and 1 special char" })
    password!: string;
}

export class GetUserDTO {
    // @ApiPropertyOptional()
    @ApiProperty({
        description:"Get User with a specific Id",
        example:1234,
    })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    id!: number
}

export class PatchUserDTO extends PartialType(CreateUserDto) { }