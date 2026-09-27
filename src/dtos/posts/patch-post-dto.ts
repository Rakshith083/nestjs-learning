
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreatePostDto } from "./post.dto";

export class PatchPostDto extends PartialType(CreatePostDto) {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "Id of the post that needs update" })
    id!: number
}