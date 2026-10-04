import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploads } from '../uploads.entity';
import { Repository } from 'typeorm';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class UploadsService {
    constructor(
        @InjectRepository(Uploads)
        private readonly uploadsRepository: Repository<Uploads>
    ) { }
    public uploadFile(file: Express.Multer.File) {
        // Implement the logic to handle file uploads here
        const newFile = this.uploadsRepository.create({
            name: file.originalname,
            data: file.buffer,
            mimeType: file.mimetype,
            size: file.size,
            path: `uploads/${file.originalname}`,
            type: this.getFileType(file.mimetype),
        });
        return this.uploadsRepository.save(newFile);
    }

    public getFileById(id: number) {
        const file = this.uploadsRepository.findOne({ where: { id } });
        if (!file) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }
        return file;
    }

    private getFileType(mimeType: string): string {
        if (mimeType.startsWith('image/')) {
            return FileType.IMAGE;
        }
        if (mimeType.startsWith('video/')) {
            return FileType.VIDEO;
        }
        if (mimeType.startsWith('audio/')) {
            return FileType.AUDIO;
        }
        return FileType.OTHER;
    }
}
