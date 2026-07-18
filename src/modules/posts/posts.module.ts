import { Module } from "@nestjs/common";
import { PostController } from "./posts.controller";
import { PostsService } from './providers/posts.service';
import { UsersModule } from "../users/users.module";

@Module({
    providers: [PostsService],
    controllers: [PostController],
    imports:[UsersModule]
})
export class PostsModule {

}