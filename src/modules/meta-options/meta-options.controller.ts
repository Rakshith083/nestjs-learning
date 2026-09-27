import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptinsService } from './providers/meta-optins.service';

@Controller('meta-options')
export class MetaOptionsController {

    constructor(
        private readonly metaOpService: MetaOptinsService
    ) { }

    @Post()
    public async createMetaOp(@Body() body) {
        return await this.metaOpService.createMetaOp(body)
    }
}
