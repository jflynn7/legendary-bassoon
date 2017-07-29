import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}