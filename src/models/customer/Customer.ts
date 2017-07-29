import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from '../merchant/Product';

@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Product, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinTable()
    favourites: Product[];
}