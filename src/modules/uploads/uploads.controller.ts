import { ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import type { Express, Response } from 'express';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService) {
    }

    @Post('file')
    @UseInterceptors(
        FileInterceptor('file'),
        ClassSerializerInterceptor)
    @ApiHeaders([
        {
            name: 'Content-Type',
            description: 'multipart/form-data',
            required: true,
        },
        {
            name: 'Authorization',
            description: 'Bearer token for authentication',
            required: true,
        },
    ])
    @ApiOperation({
        summary: 'Upload file',
        description: 'Uploads a single file to the server.',
    })
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadsService.uploadFile(file);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get file by ID',
        description: 'Retrieves a file by its ID.',
    })
    public async getFileById(@Param('id') id: number, @Res() res: Response) {
        try {
            const file = await this.uploadsService.getFileById(id);
            if (!file) {
                throw new NotFoundException(`File with ID ${id} not found`);
            }
            res.setHeader('Content-Type', file.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
            res.send(file.data);
        }
        catch (error) {
            throw error;
        }
    }
}
