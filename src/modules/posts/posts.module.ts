import { Module } from "@nestjs/common";
import { PostController } from "./posts.controller";
import { PostsService } from './providers/posts.service';
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { MetaOptions } from "../meta-options/meta-option.entity";

@Module({
    providers: [PostsService],
    controllers: [PostController],
    imports: [UsersModule, TypeOrmModule.forFeature([Post,MetaOptions])]
})
export class PostsModule {

}