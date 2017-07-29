import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Merchant } from './Merchant';

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

    @Column()
    views: number;

    @Column()
    isPublished: boolean;

    @ManyToOne(type => Merchant, merchant => merchant.products, {
        cascadeInsert: true,
        cascadeRemove: true,
        onDelete: 'SET NULL'
    })
    merchant: Merchant|null;
}