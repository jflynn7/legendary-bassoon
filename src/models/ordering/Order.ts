import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { OrderedProduct } from './OrderedProduct';
import { Merchant } from '../merchant/Merchant';

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    orderDate: Date;

    @Column()
    orderTotal: number;

    @Column()
    merchantId: number;

    @OneToMany(type => OrderedProduct, orderedProduct => orderedProduct.order, { cascadeInsert: true, cascadeUpdate: true })
    @JoinColumn()
    orderedProducts: OrderedProduct[];

    merchant: Merchant|null;

}