import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDTO{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty(
        {
            description:"email for signin",
            example:"john@example.com"
        }
    )
    email:string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty(
        {
            description:"password for signin",
            example:"YOUR PASSWORD"
        }
    )
    password:string;
}