import { Body, Controller, Get, Logger, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { CreatePostDto, PatchPostDto } from "src/dtos/posts/post.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('posts')
export class PostController {
    constructor(
        //Injecting post service
        private readonly postService: PostsService
    ) { }
    private logger = new Logger(PostController.name)

    @Get()
    public getPosts() {

    }

    @Get('/:userId')
    public getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
        return this.postService.findUserPosts(userId);
    }

    @Post()
    @ApiOperation({
        description: "Api creates a new blog post"
    })
    @ApiResponse({
        status: 201,
        description: "You get 201 status code if the post created successfully"
    })
    public createPost(@Body() body: CreatePostDto): any {
        this.logger.log(body);
        return "Create Post"
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
        this.logger.log(body);
        return "Post updated"
    }
}