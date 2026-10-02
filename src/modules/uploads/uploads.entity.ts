import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FileType } from "./enums/file-type.enum";
import { Exclude } from "class-transformer";

@Entity()
export class Uploads {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false
    })
    path: string;

    @Column({
        type: 'enum',
        enum: FileType,
        default: FileType.OTHER,
        nullable: false
    })
    type: string;

    @Column({
        type: 'varchar',
        length: 128,
        nullable: false
    })
    mimeType: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false
    })
    size: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false
    })
    updatedAt: Date;

    @Column({
        type: 'bytea',
    })
    @Exclude()
    data: Buffer;
}