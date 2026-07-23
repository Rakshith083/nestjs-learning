import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create.tag.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
    constructor(
        private readonly tagService: TagsService
    ) { }

    @ApiOperation({
        description: "Creates a new Tag"
    })
    @ApiResponse({
        status: 201,
        description: "status 201 on successfully creating post"
    })
    @Post()
    public async createTag(@Body() body: CreateTagDto) {
        const tag = await this.tagService.createTags(body)
        return tag
    }
}
