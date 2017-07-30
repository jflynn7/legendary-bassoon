import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { OrderedProduct } from './OrderedProduct';

@Entity()
export class CustomerOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    orderDate: Date;

    @Column()
    orderTotal: number;

    @OneToMany(type => OrderedProduct, orderedProduct => orderedProduct.order, { cascadeInsert: true, cascadeUpdate: true })
    @JoinColumn()
    orderedProducts: OrderedProduct[];

}