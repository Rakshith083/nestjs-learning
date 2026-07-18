import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

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
}