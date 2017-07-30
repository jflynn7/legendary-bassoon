import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Product} from '../merchant/Product';
import {Customer} from './Customer';

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @ManyToOne(type => Customer, customer => customer.comments, {
        cascadeInsert: true,
        cascadeRemove: true,
        onDelete: 'SET NULL'
    })
    customer: Customer|null;

    @ManyToOne(type => Product, product => product.comments, {
        cascadeInsert: true,
        cascadeRemove: true,
        onDelete: 'SET NULL'
    })
    product: Product|null;
}