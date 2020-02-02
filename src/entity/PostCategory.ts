import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class PostCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}