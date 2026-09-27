import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
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

    public async findTagsByIds(tags: number[]) {
        const tags_data = await this.tagsRepo.find({ where: { id: In(tags) } });
        return tags_data;
    }

    public async deleteTag(id: number) {
        const deleted = await this.tagsRepo.delete(id)
        return { deleted }
    }

    public async softRemove(id: number) {
        const deleted = await this.tagsRepo.softDelete(id)
        return { deleted }
    }
}
