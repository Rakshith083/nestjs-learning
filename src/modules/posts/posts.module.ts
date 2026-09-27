import { Module } from "@nestjs/common";
import { PostController } from "./posts.controller";
import { PostsService } from './providers/posts.service';
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { MetaOptions } from "../meta-options/meta-option.entity";
import { TagsModule } from "../tags/tags.module";
import { PaginationModule } from "../common/pagination.module";

@Module({
    providers: [PostsService],
    controllers: [PostController],
    imports: [
        UsersModule, 
        TagsModule,
        PaginationModule,
        TypeOrmModule.forFeature([Post, MetaOptions])
    ]
})
export class PostsModule {

}