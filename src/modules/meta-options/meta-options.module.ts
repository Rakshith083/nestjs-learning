import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOptionsController } from './meta-options.controller';
import { MetaOptinsService } from './providers/meta-optins.service';
import { MetaOptions } from './meta-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetaOptions])],
  controllers: [MetaOptionsController],
  providers: [MetaOptinsService],
})
export class MetaOptionsModule { }
