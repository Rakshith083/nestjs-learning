import { IsArray, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsNumber, IsOptional, isString, IsString, IsUrl, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { postType } from "./enums/postType.enum";
import { postStatus } from "./enums/postStatus.enum";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreatePostMetaOptionsDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    key!: string

    @IsNotEmpty()
    value!: any
}


export class CreatePostDto {
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @ApiProperty({
        type: String,
        description: "Title of a blog post",
        example: "This is a title"
    })
    title!: string

    @IsEnum(postType, { message: "Invalid enum" })
    @IsNotEmpty()
    @ApiProperty({
        enum: postType,
        description: `Possible values are ${Object.values(postType).join(', ')}`
    })
    postType!: postType

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "A slug should be all small letters and use only '-' and without space. ex: 'my-url'"
    })
    @ApiProperty({
        description: "Slug",
        example: "my-slug"
    })
    slug!: string

    @IsEnum(postStatus, { message: "Invalid enum" })
    @IsNotEmpty()
    @ApiProperty({
        enum: postStatus,
        description: `Possible values are ${Object.values(postStatus).join(', ')}`
    })
    status!: postStatus

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "This is the content of the post",
        example: "The post content"
    })
    content?: string

    @IsString()
    @IsJSON()
    @ApiPropertyOptional({
        description: "A stringified json",
        example: "{\"@context\":\"https://www.google.com\",\"@type\":\"string\"}"
    })
    schema?: string

    @IsUrl()
    @IsOptional()
    @ApiPropertyOptional({
        description: "link of the featured image",
        example: "https://www.w3schools.com/html/html_images.asp"
    })
    featuredImageUrl?: string

    @IsISO8601()
    @IsOptional()
    @ApiPropertyOptional({
        description: "blog post published date",
        example: "2026-07-16T17:56:14.950Z"
    })
    publishedOn?: Date

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MinLength(3, { each: true })
    @ApiPropertyOptional({
        description: "Array of tags passed as string values",
        example: ["nestJs", "tsc"]
    })
    tags?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePostMetaOptionsDto)
    @ApiPropertyOptional(
        {
            type: 'array',
            required: false,
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                        description: "The key can be string identifier for meta options",
                        example: "sideBarEnabled"
                    },
                    value: {
                        type: 'any',
                        description: "Any value that you want to save to DB",
                        example: true
                    }
                }
            }
        }
    )
    metaOptions?: CreatePostMetaOptionsDto[]

}