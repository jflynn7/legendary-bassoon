import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, UpdateDateColumn,
    CreateDateColumn, ManyToOne
} from 'typeorm';
import {Product} from './Product';
import {Supplier} from './Supplier';
import {Order} from '../ordering/Order';

@Entity()
export class Merchant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(type => Product, product => product.merchant, { cascadeInsert : true})
    products: Product[];

    @ManyToMany(type => Supplier, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinTable()
    suppliers: Supplier[];
}