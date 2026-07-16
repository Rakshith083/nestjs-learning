import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { CreatePostDto } from "src/dtos/posts/post.dto";

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
    public createPost(@Body() body: CreatePostDto): any {
        this.logger.log(body);
        return "Create Post"
    }
}