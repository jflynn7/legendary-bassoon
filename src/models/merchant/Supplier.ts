import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supplier {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    addressLine1: string;

    @Column()
    addressLine2: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    postcode: string;

    @Column()
    email: string;

    @Column()
    contactNumber: string;

    @Column()
    contactName: string;
}