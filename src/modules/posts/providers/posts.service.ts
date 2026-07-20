import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from 'src/dtos/posts/post.dto';
import { UserService } from 'src/modules/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,
        private readonly userService: UserService
    ) { }

    private logger = new Logger(PostsService.name);
    public async findAllPosts() {
        const posts = await this.postsRepo.find({
            // relations: { "metaOptions": true }
        });
        return posts;
    }

    public async createPost(body: CreatePostDto) {
        let post = this.postsRepo.create(body);
        return await this.postsRepo.save(post)
    }
}
