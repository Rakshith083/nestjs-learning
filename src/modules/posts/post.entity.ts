import { postStatus } from "src/dtos/posts/enums/postStatus.enum";
import { postType } from "src/dtos/posts/enums/postType.enum";
import { CreatePostMetaOptionsDto } from "src/dtos/posts/post.dto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
        length:1024

    })
    featuredImageUrl?: string;

    @Column({
        nullable: true,
        type: 'timestamp',

    })
    publishedOn?: Date;


    tags?: string[];
    metaOptions?: CreatePostMetaOptionsDto[]
}