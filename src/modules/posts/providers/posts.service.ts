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
    public async findAllPosts() {
        const posts = await this.postsRepo.find({
            relations: {
                // metaOptions: true,
                // author: true
            }
        });
        return posts;
    }

    public async createPost(body: CreatePostDto) {
        const author = await this.userService.findUserById(body.authorId);
        if (!author) {
            throw new Error('Author not found')
        }
        let post = this.postsRepo.create({
            ...body,
            author: author
        });
        return await this.postsRepo.save(post)
    }

    public async deletePost(id: number) {
        await this.postsRepo.delete(id)
        return { deleted: true, id }
    }
}
