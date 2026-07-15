import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";

@Controller('posts')
export class PostController {
    constructor(
        //Injecting post service
        private readonly postService: PostsService
    ) { }

    @Get()
    public getPosts() {

    }

    @Get('/:userId')
    public getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
        return this.postService.findUserPosts(userId);
    }
}