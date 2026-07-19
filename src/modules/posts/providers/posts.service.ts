import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from 'src/dtos/posts/post.dto';
import { UserService } from 'src/modules/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptions } from 'src/modules/meta-options/meta-option.entity';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,

        @InjectRepository(MetaOptions)
        private readonly metaOptionsRepo: Repository<MetaOptions>,

        private readonly userService: UserService
    ) { }

    private logger = new Logger(PostsService.name);
    public async findUserPosts(userId: number) {
        const user = await this.userService.findUserById(userId)
        return [
            {
                ...{ user },
                title: "Test Title",
                content: "test content"
            },
            {
                ...{ user },
                title: "Test Title1",
                content: "test content1"
            }
        ]
    }

    public async createPost(body: CreatePostDto) {
        let metaOp = body.metaOptions ? this.metaOptionsRepo.create(body.metaOptions) : null;
        metaOp && await this.metaOptionsRepo.save(metaOp);

        let post = this.postsRepo.create(body);
        metaOp ? post.metaOptions = metaOp : null
        return await this.postsRepo.save(post)
    }
}
