import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uploads } from './uploads.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [
    TypeOrmModule.forFeature([Uploads]),
  ],
})
export class UploadsModule { }
