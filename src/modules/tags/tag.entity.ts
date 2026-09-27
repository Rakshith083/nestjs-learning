import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "../posts/post.entity";


@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true,
        length: 256
    })
    name: string;


    @Column({
        type: 'varchar',
        nullable: false,
        unique: true,
        length: 256
    })
    slug: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Column({
        type: 'text',
        nullable: true
    })
    schema?: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 1024
    })
    featuredImageUrl?: string

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @DeleteDateColumn()
    deleteDate: Date;

    @ManyToMany(
        () => Post,
        (post) => post.tags,
        { onDelete: 'CASCADE' }
    )
    posts: Post[]
}