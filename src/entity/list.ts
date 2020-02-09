
import { Entity, PrimaryGeneratedColumn, Column, TreeParent } from 'typeorm';

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeParent()
    parent: List;
}
