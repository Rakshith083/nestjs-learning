import { IsNotEmpty, IsString, MinLength } from "class-validator"


export class CreatePostMetaOptionsDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    key: string

    @IsNotEmpty()
    value: any
}
