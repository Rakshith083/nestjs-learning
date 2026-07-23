import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { CreatePostDto } from "src/dtos/posts/post.dto";

import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PatchPostDto } from "src/dtos/posts/patch-post-dto";

@Controller('posts')
export class PostController {
    constructor(
        //Injecting post service
        private readonly postService: PostsService
    ) { }
    private logger = new Logger(PostController.name)

    @Get()
    public async getPosts() {
        return await this.postService.findAllPosts();
    }

    @Get('/:userId')
    public async getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
        // return await this.postService.findAllPosts(userId);
    }

    @Post()
    @ApiOperation({
        description: "Api creates a new blog post"
    })
    @ApiResponse({
        status: 201,
        description: "You get 201 status code if the post created successfully"
    })
    public createPost(@Body() body: CreatePostDto) {
        return this.postService.createPost(body);
    }

    @ApiOperation({
        summary: "This api updates an existing post",
    })
    @ApiResponse({
        status: 200,
        description: "200 response code on successfully updating"
    })
    
    @Patch()
    public updatePOst(@Body() body: PatchPostDto) {
        return this.postService.updatePost(body)
    }


    @Delete()
    public async deletePost(@Query('id', ParseIntPipe) id: number) { 
        return await this.postService.deletePost(id)
    }
}