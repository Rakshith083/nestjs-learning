import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create.tag.dto';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepo: Repository<Tag>
    ) { }

    public async createTags(body: CreateTagDto) {
        const tag = this.tagsRepo.create(body)
        return await this.tagsRepo.save(body)
    }
}
