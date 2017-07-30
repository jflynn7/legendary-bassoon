import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Product } from '../merchant/Product';
import { Comment } from './Comment';

@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @OneToMany(type => Comment, comment => comment.customer, { cascadeInsert : true})
    comments: Comment[];

    @ManyToMany(type => Product, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinTable()
    favourites: Product[];

}