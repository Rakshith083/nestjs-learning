import { postStatus } from "src/dtos/posts/enums/postStatus.enum";
import { postType } from "src/dtos/posts/enums/postType.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MetaOptions } from "../meta-options/meta-option.entity";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 65
    })
    title: string;

    @Column({
        type: 'enum',
        nullable: false,
        enum: postType,
        default: postType.POST
    })
    postType: postType;

    @Column({
        length: 256,
        nullable: false,
        unique: true
    })
    slug: string;

    @Column({
        type: 'enum',
        nullable: false,
        enum: postStatus,
        default: postStatus.DRAFT
    })
    status: postStatus;

    @Column({
        nullable: true,
        type: 'text',

    })
    content?: string;

    @Column({
        nullable: true,
        type: 'text',

    })
    schema?: string;

    @Column({
        nullable: true,
        type: 'varchar',
        length: 1024

    })
    featuredImageUrl?: string;

    @Column({
        nullable: true,
        type: 'timestamp',

    })
    publishedOn?: Date;

    @OneToOne(() => MetaOptions, (metaOptions) => metaOptions.post, {
        cascade: true,
        eager: true
    })
    metaOptions?: MetaOptions;

    tags?: string[];
}