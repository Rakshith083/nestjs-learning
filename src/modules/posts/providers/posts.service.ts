import { BadRequestException, Injectable, Logger, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreatePostDto } from 'src/dtos/posts/post.dto';
import { UserService } from 'src/modules/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptions } from 'src/modules/meta-options/meta-option.entity';
import { TagsService } from 'src/modules/tags/providers/tags.service';
import { PatchPostDto } from 'src/dtos/posts/patch-post-dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,

        @InjectRepository(MetaOptions)
        private readonly metaOptionsRepo: Repository<MetaOptions>,

        private readonly userService: UserService,
        private readonly tagsService: TagsService,
        private readonly configService: ConfigService
    ) { }

    private logger = new Logger(PostsService.name);
    public async findAllPosts() {
        const posts = await this.postsRepo.find({
            relations: {
                // metaOptions: true,
                // author: true
                // tags: true
            }
        });
        this.logger.log("DB_HOST", this.configService.get('DB_HOST'))
        return posts;
    }

    public async createPost(body: CreatePostDto) {
        const author = await this.userService.findUserById(body.authorId);
        if (!author) {
            throw new Error('Author not found')
        }
        const tags = await this.tagsService.findTagsByIds(body.tags ?? [])
        let post = this.postsRepo.create({
            ...body,
            author: author,
            tags: tags
        });
        return await this.postsRepo.save(post)
    }

    public async deletePost(id: number) {
        await this.postsRepo.delete(id)
        return { deleted: true, id }
    }

    public async updatePost(body: PatchPostDto) {
        let tags_data: any, post: any;
        try {
            tags_data = await this.tagsService.findTagsByIds(body.tags ?? []);

        }
        catch (e) {
            this.logger.error(e)
            throw new RequestTimeoutException('Error occurred while fetching tags', {
                description: 'Error occurred while fetching tags',
                cause: e
            });
        }

        if (!tags_data || tags_data.length !== (body.tags ?? []).length) {
            throw new BadRequestException('Some tags not found', {
                description: 'Some tags not found',
                cause: new Error('Some tags not found')
            });
        }

        try {
            post = await this.postsRepo.findOneBy({ id: body.id })
        } catch (e) {
            this.logger.error(e)
            throw new RequestTimeoutException('Error occurred while fetching post', {
                description: 'Error occurred while fetching post',
                cause: e
            });
        }
        if (!post) {
            throw new NotFoundException('Post Id Does not exist', {
                description: 'Post Id Does not exist',
                cause: new Error('Post Id Does not exist')
            });
        }

        post.title = body.title ?? post.title;
        post.status = body.status ?? post.status;
        post.content = body.content ?? post.content;
        post.postType = body.postType ?? post.postType;
        post.slug = body.slug ?? post.slug;
        post.featuredImageUrl = body.featuredImageUrl ?? post.featuredImageUrl;
        post.publishedOn = body.publishedOn ?? post.publishedOn;

        post.tags = tags_data;
        try {
            await this.postsRepo.save(post);
        } catch (e) {
            this.logger.error(e)
            throw new RequestTimeoutException('Error occurred while updating post', {
                description: 'Error occurred while updating post',
                cause: e
            });
        }
        return post
    }
}
