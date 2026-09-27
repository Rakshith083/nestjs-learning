import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOptions } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptinsService {
    constructor(
        @InjectRepository(MetaOptions)
        private readonly metaOpRepo: Repository<MetaOptions>
    ) { }

    public async createMetaOp(payload: CreatePostMetaOptionsDto) {
        const metaOption = this.metaOpRepo.create(payload);
        return await this.metaOpRepo.save(metaOption)
    }
}
