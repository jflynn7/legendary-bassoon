import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn
} from 'typeorm';
import { Product } from '../merchant/Product';
import { Order } from './Order';

@Entity()
export class OrderedProduct {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @OneToOne(type => Product, {
        cascadeInsert: true,
        cascadeRemove: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    product: Product|null;

    @ManyToOne(type => Order, order => order.orderedProducts)
    order: Order;

}