import { IsJSON, IsNotEmpty, IsString, MinLength } from "class-validator"


export class CreatePostMetaOptionsDto {
    @IsNotEmpty()
    @IsJSON()
   metaValue:string
}
