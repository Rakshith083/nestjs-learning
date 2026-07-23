import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Post } from "../posts/post.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    password: string;

    @OneToMany(() => Post, (posts) => posts.author)
    posts: Post[]
}