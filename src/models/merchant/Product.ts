import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany
} from 'typeorm';
import { Merchant } from './Merchant';
import { Comment } from '../customer/Comment';
import { OrderedProduct } from '../ordering/OrderedProduct';

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column({ default: 0 })
    views: number;

    @ManyToOne(type => Merchant, merchant => merchant.products, {
        cascadeInsert: true,
        cascadeRemove: true,
        onDelete: 'SET NULL'
    })
    merchant: Merchant|null;

    @OneToMany(type => Comment, comment => comment.product, { cascadeInsert : true})
    comments: Comment[];

    @ManyToOne(type => OrderedProduct, orderedProduct => orderedProduct.product, {
        cascadeInsert: true
    })
    orderedProduct: OrderedProduct;
}